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
    if (
      !req.body.password ||
      !req.body.first_name ||
      !req.body.last_name ||
      !req.body.username ||
      !req.body.role ||
      !req.body.birth_date
    ) {
      return res.status(400).json({
        status: "failed",
        message: "Please provide all the required parameters",
      });
    }
    if (req.body.password.length < 8) {
      return res.status(400).json({
        status: "failed",
        message: "Password cannot have less than 8 characters.",
      });
    }

    let connection = sql.createConnection(config);
    connection.connect();

    connection.query(
      `SET @school_ID=(SELECT ID FROM School WHERE school_name='${req.body.school}');` +
        `INSERT INTO Users (username, user_password, user_role, first_name, last_name, school_id, birth_date)` +
        `VALUES ('${req.body.username}', '${req.body.password}', '${req.body.role}', '${req.body.first_name}', '${req.body.last_name}', @school_ID, '${req.body.birth_date}');`,
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
      `SELECT check_user_login('${req.body.username}', '${req.body.password}') AS loggedInUser;`,
      async function (error, results, fields) {
        if (error)
          return res.status(500).json({
            status: "failed",
            message: error.message,
          });
        if (results[0]["loggedInUser"] == 0) {
          return res.status(400).json({
            status: "failed",
            message:
              "Your username and password do not match with a verified user of an active school.",
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

  return res
    .status(200)
    .json({ status: "success", message: "You were successfully logged out!" });
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
      `SELECT * FROM verifiedUsers WHERE username='${decoded.id}'`,
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
        req.user_id = freshUser.ID;
        req.username = freshUser.username;
        req.role = freshUser.user_role;
        req.school_id = freshUser.school_ID;
        req.first_name = freshUser.first_name;
        req.last_name = freshUser.last_name;
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

exports.changePassword = (req, res) => {
  try {
    if (!req.body.old_password) {
      return res.status(400).json({
        status: "failed",
        message: "Please write your current password first.",
      });
    }

    if (!req.body.new_password) {
      return res.status(400).json({
        status: "failed",
        message: "Please choose a new password.",
      });
    }

    if (req.body.new_password.length < 8) {
      return res.status(400).json({
        status: "failed",
        message: "Password cannot have less than 8 characters",
      });
    }

    let connection = sql.createConnection(config);
    connection.connect();

    connection.query(
      `SELECT change_password('${req.username}','${req.body.old_password}', '${req.body.new_password}') as answer;`,
      async function (error, results, fields) {
        if (error)
          return res.status(500).json({
            status: "failed",
            message: error.message,
          });

        if (results[0]["answer"] == "OK") {
          return res.status(200).json({
            status: "success",
            message: "Your password was successfully changed!",
          });
        } else {
          return res.status(401).json({
            status: "failed",
            message: "Your current password is not correct.",
          });
        }
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
