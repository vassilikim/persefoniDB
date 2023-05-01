const { isNull } = require("util");
var config = require("../dbconfig");
const sql = require("mysql");

exports.getNotVerifiedTeachersStudents = async (req, res, next) => {
  try {
    let connection = sql.createConnection(config);
    connection.connect();

    connection.query(
      `SELECT * FROM activeUsers WHERE (user_role='teacher' OR user_role='student') AND verified=0 AND school_ID=${req.school_id};`,
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

exports.verifyTeacherStudent = async (req, res, next) => {
  try {
    if (!req.body.username) {
      return res.status(400).json({
        status: "failed",
        message: "Please choose which teacher/student you want to verify.",
      });
    }

    let connection = sql.createConnection(config);
    connection.connect();

    connection.query(
      `SELECT verify_teacher_student(${req.school_id}, '${req.body.username}') as answer;`,
      async function (error, results, fields) {
        if (error)
          return res.status(500).json({
            status: "failed",
            message: error.message,
          });

        if (results[0]["answer"] == "OK") {
          return res.status(200).json({
            status: "success",
            message: "The teacher/student was successfully verified!",
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

exports.getUsersWithDelayedLending = async (req, res, next) => {
  try {
    if (!req.query.first_name) req.query.first_name = null;
    else req.query.first_name = `'${req.query.first_name}'`;
    if (!req.query.last_name) req.query.last_name = null;
    else req.query.last_name = `'${req.query.last_name}'`;
    if (!req.query.delay) req.query.delay = null;

    let connection = sql.createConnection(config);
    connection.connect();

    connection.query(
      `CALL get_users_delayed_return(${req.query.first_name}, ${req.query.last_name}, ${req.query.delay}, ${req.school_id})`,
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

exports.getAverageRatingPerGenreAndUser = async (req, res, next) => {
  try {
    let isNull = false;
    if (!req.query.full_name) {
      isNull = true;
      req.query.full_name = null;
    } else req.query.full_name = `'${req.query.full_name}'`;
    if (!req.query.genre) {
      isNull = true;
      req.query.genre = null;
    } else req.query.genre = `'${req.query.genre}'`;

    let connection = sql.createConnection(config);
    connection.connect();

    connection.query(
      `CALL get_avg_rating_per_genre_user(${req.query.genre}, ${req.query.full_name}, ${req.school_id})`,
      async function (error, results, fields) {
        if (error)
          return res.status(500).json({
            status: "failed",
            message: error.message,
          });

        return res.status(200).json({
          status: "success",
          data1: results[0],
          data2: isNull ? results[1] : null,
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
