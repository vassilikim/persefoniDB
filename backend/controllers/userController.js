var config = require("../dbconfig");
const sql = require("mysql");
var jwt = require("jsonwebtoken");

exports.getAllTeachersStudents = async (req, res, next) => {
  try {
    let connection = sql.createConnection(config);
    connection.connect();

    connection.query(
      `SELECT * FROM verifiedUsers WHERE (user_role='teacher' OR user_role='student') AND school_ID=${req.school_id} ORDER BY user_role;`,
      async function (error, results, fields) {
        if (error)
          return res.status(500).json({
            status: "failed",
            message: error.message,
          });

        return res.status(200).json({
          status: "success",
          data: results,
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

exports.deactivateTeacherStudent = async (req, res, next) => {
  try {
    if (!req.body.username) {
      return res.status(400).json({
        status: "failed",
        message: "The teacher/student's username can't be blank!",
      });
    }

    let connection = sql.createConnection(config);
    connection.connect();

    connection.query(
      `SELECT deactivate_user(${req.school_id}, '${req.body.username}') as answer;`,
      async function (error, results, fields) {
        if (error)
          return res.status(500).json({
            status: "failed",
            message: error.message,
          });

        if (results[0]["answer"] == "OK") {
          return res.status(200).json({
            status: "success",
            message: "The teacher/student was successfully deactivated!",
          });
        } else if (results[0]["answer"] == "NO USER") {
          return res.status(400).json({
            status: "failed",
            message:
              "There is no verified teacher/student with this username in your school!",
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

exports.deleteTeacherStudent = async (req, res, next) => {
  try {
    if (!req.body.username) {
      return res.status(400).json({
        status: "failed",
        message: "The teacher/student's username can't be blank!",
      });
    }

    let connection = sql.createConnection(config);
    connection.connect();

    connection.query(
      `SELECT delete_user(${req.school_id}, '${req.body.username}') as answer;`,
      async function (error, results, fields) {
        if (error)
          return res.status(500).json({
            status: "failed",
            message: error.message,
          });

        if (results[0]["answer"] == "OK") {
          return res.status(200).json({
            status: "success",
            message: "The teacher/student was successfully deleted!",
          });
        } else if (results[0]["answer"] == "NO USER") {
          return res.status(400).json({
            status: "failed",
            message:
              "There is no teacher/student with this username in your school!",
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

exports.getAccountInfo = async (req, res, next) => {
  try {
    let connection = sql.createConnection(config);
    connection.connect();

    connection.query(
      `SELECT u.username, u.first_name, u.last_name, s.school_name 
      FROM verifiedUsers u JOIN School s ON u.school_ID=s.ID
      WHERE u.username='${req.username}'`,
      async function (error, results, fields) {
        if (error)
          return res.status(500).json({
            status: "failed",
            message: error.message,
          });

        return res.status(200).json({
          status: "success",
          data: results[0],
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

exports.updateAccountInfo = async (req, res, next) => {
  try {
    if (!req.body.username || !req.body.first_name || !req.body.last_name) {
      return res.status(400).json({
        status: "failed",
        message: "Please provide all the required parameters!",
      });
    }

    let connection = sql.createConnection(config);
    connection.connect();

    connection.query(
      `UPDATE Users 
      SET username='${req.body.username}', first_name='${req.body.first_name}', last_name='${req.body.last_name}'
      WHERE username='${req.username}'`,
      async function (error, results, fields) {
        if (error)
          return res.status(500).json({
            status: "failed",
            message: error.message,
          });

        if (results.affectedRows == 0) {
          return res.status(400).json({
            status: "failed",
            message: "The user was not found!",
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
          status: "success",
          token: token,
          message: "Your account info was successfully updated!",
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
