var config = require("../dbconfig");
const sql = require("mysql");
var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");
const { promisify } = require("util");

changedPasswordAfter = function (JWTTimestamp, passwordChangedAt) {
  if (passwordChangedAt) {
    const changedTimestamp = parseInt(passwordChangedAt.getTime() / 1000, 10);
    return JWTTimestamp < changedTimestamp;
  }
  return false;
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

    let connection = sql.createConnection(config);
    connection.connect();

    connection.query(
      `SET @school_ID=(SELECT ID FROM School WHERE school_name='${req.body.school}');` +
        `INSERT INTO Users (username, user_password, user_role, first_name, last_name, school_id)` +
        `VALUES ('${req.body.username}', '${req.body.password}', '${req.body.role}', '${req.body.first_name}', '${req.body.last_name}', @school_ID);`,
      function (error, results, fields) {
        if (error)
          return res.status(500).json({
            status: "failed",
            message: error.message,
          });
        return res.status(200).json({
          status: "success",
          message:
            "You were signed up successfully! Please wait to be verified.",
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
    if (!req.body.username || !req.body.password) {
      return res.status(400).json({
        status: "failed",
        message: "Please provide username and password",
      });
    }

    let connection = sql.createConnection(config);
    connection.connect();

    connection.query(
      `SELECT COUNT(*) FROM Users WHERE username = '${req.body.username}'` +
        `AND user_password = SHA2(CONCAT('${process.env.PASSWORD_HASHING_SALT}', '${req.body.password}'), 256);`,
      async function (error, results, fields) {
        if (error)
          return res.status(500).json({
            status: "failed",
            message: error.message,
          });
        if (results[0]["COUNT(*)"] == 0) {
          return res.status(400).json({
            status: "failed",
            message: "Incorrect username or password",
          });
        }

        const token = jwt.sign(
          { id: req.body.username },
          process.env.JWT_SECRET,
          {
            expiresIn: process.env.JWT_EXPIRES_IN,
          }
        );

        const cookieOptions = {
          expires: new Date(
            Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
          ),
          httpOnly: true,
        };

        res.cookie("jwt", token, cookieOptions);

        return res.status(200).json({
          token: token,
        });
      }
    );
    connection.end();
  } catch (err) {
    return res.status(500).json({
      status: "failed",
      message: err.message,
    });
  }
};

exports.logout = (req, res) => {
  res.cookie("jwt", "loggedout", {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true,
  });

  res.status(200).json({ status: "success" });
};

exports.protect = async (req, res, next) => {
  try {
    let token;
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    } else if (req.cookies.jwt) token = req.cookies.jwt;

    if (!token) {
      return res.status(401).json({
        status: "failed",
        message: "Please login to get access.",
      });
    }

    const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

    let connection = sql.createConnection(config);
    connection.connect();

    connection.query(
      `SELECT * FROM Users WHERE username='${decoded.id}'`,
      function (error, results, fields) {
        if (error)
          return res.status(500).json({
            status: "failed",
            message: error.message,
          });

        if (results.length == 0) {
          return res.status(401).json({
            status: "failed",
            message: "User no longer exists.",
          });
        }
        let freshUser = results[0];

        if (
          changedPasswordAfter(decoded.iat, freshUser["changed_password_at"])
        ) {
          return res.status(401).json({
            status: "failed",
            message:
              "User recently changed their password! Please login again.",
          });
        }
        req.username = freshUser.username;
        req.role = freshUser.user_role;
        req.school_id = freshUser.school_ID;
        next();
      }
    );
    connection.end();
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

exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.role)) {
      return res.status(403).json({
        status: "failed",
        message: "You don't have permission to perform this action!",
      });
    }
    next();
  };
};
