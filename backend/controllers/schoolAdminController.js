var config = require("../dbconfig");
const sql = require("mysql");

exports.getNotVerifiedTeachersStudents = async (req, res, next) => {
  try {
    let connection = sql.createConnection(config);
    connection.connect();

    connection.query(
      `SELECT * FROM Users WHERE (user_role='teacher' OR user_role='student') AND verified=0;`,
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
      `UPDATE Users SET verified=1 WHERE username='${req.body.username}' 
      AND (user_role='teacher' OR user_role='student') AND verified=0;`,
      async function (error, results, fields) {
        if (error)
          return res.status(500).json({
            status: "failed",
            message: error.message,
          });

        if (results.affectedRows == 0) {
          return res.status(400).json({
            status: "failed",
            message:
              "There is no not verified teacher/student with this username!",
          });
        }

        return res.status(200).json({
          status: "success",
          message: "The teacher/student is now successfully verified!",
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
