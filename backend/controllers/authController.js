var config = require("../dbconfig");
const sql = require("mysql");
var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");

correctPassword = async function (candidatePassword, userPassword) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

exports.signup = async (req, res) => {
  try {
    if (!req.body.password) {
      return res.status(400).json({
        status: "failed",
        message: "Please provide all the required parameters",
      });
    }
    if (req.body.password.length < 8) {
      return res.status(400).json({
        status: "failed",
        message: "Password cannot have less than 8 characters",
      });
    }

    let password = await bcrypt.hash(req.body.password, 12);

    var connection = sql.createConnection(config);
    connection.connect();

    connection.query(
      `SET @school_ID=(SELECT ID FROM School WHERE school_name='${req.body.school}'); INSERT INTO Users (username, user_password, user_role, first_name, last_name, school_id) VALUES ('${req.body.username}', '${password}', '${req.body.role}', '${req.body.first_name}', '${req.body.last_name}', @school_ID);`,
      function (error, results, fields) {
        if (error)
          return res.status(500).json({
            status: "failed",
            message: error.message,
          });
        return res.status(200).json({
          status: "success",
          message:
            "You were signed up successfully! Please wait to be verified if you are a teacher or a student.",
        });
      }
    );
    connection.end();
  } catch (error) {
    return res.status(500).json({
      status: "failed",
      message: error.message,
    });
  }
};

exports.login = async (req, res, next) => {
  try {
    if (!req.body.emailaddress || !req.body.password) {
      return res.status(400).json({
        status: "failed",
        message: "Please provide email address and password",
      });
    }

    let pool = await sql.connect(config);
    let customer = await pool
      .request()
      .input("emailaddress", sql.NVarChar, req.body.emailaddress)
      .query("SELECT * FROM tblcustomer WHERE emailaddress=@emailaddress");
    customer = customer.recordsets[0];

    if (
      customer.length == 0 ||
      !(await correctPassword(req.body.password, customer[0].password))
    ) {
      return res.status(400).json({
        status: "failed",
        message: "Incorrect username or password",
      });
    }

    const token = jwt.sign({ id: customer[0].id }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN,
    });

    return res.status(200).json({
      token: token,
    });
  } catch (err) {
    return res.status(500).json({
      status: "failed",
      message: err.message,
    });
  }
};

exports.protect = async (req, res, next) => {
  try {
    let token;
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      return res.status(401).json({
        status: "failed",
        message: "Please log in to get access.",
      });
    }

    const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

    let pool = await sql.connect(config);
    let customer = await pool
      .request()
      .input("Id", sql.UniqueIdentifier, decoded.id)
      .query("SELECT * FROM tblcustomer WHERE Id=@Id");
    customer = customer.recordsets[0];

    if (customer.length == 0) {
      return res.status(401).json({
        status: "failed",
        message: "User no longer exists.",
      });
    }

    // if (freshUser.changedPasswordAfter(decoded.iat)) {
    //   responseMessage = {
    //     status: "failed",
    //     message: "User recently changed password. Please log in again.",
    //   };
    //   return handleResponse(req, res, 401, handleResponse);
    // }

    req.email = customer[0].emailaddress;
    req.pelperi = customer[0].peri;
    req.phone = customer[0].phone;
    req.mobile = customer[0].mobile;
    req.pelid = customer[0].id;

    next();
  } catch (err) {
    if (err.name === "JsonWebTokenError") {
      return res.status(401).json({
        status: "failed",
        message: "Please login to get access.",
      });
    } else if (err.name === "TokenExpiredError") {
      return res.status(401).json({
        status: "failed",
        message: "Token has expired. Please login again.",
      });
    } else {
      return res.status(500).json({
        status: "failed",
        message: err.message,
      });
    }
  }
};
