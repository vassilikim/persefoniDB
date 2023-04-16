var config = require("../dbconfig");
const sql = require("mysql");

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
