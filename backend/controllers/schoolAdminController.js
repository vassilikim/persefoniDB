var config = require("../dbconfig");
const sql = require("mysql");

exports.verifySchoolAdmin = async (req, res, next) => {
  try {
    if (!req.body.school_admin) {
      return res.status(500).json({
        status: "failed",
        message: "Please provide all the required parameters.",
      });
    }

    let connection = sql.createConnection(config);
    connection.connect();

    connection.query(
      `UPDATE Users SET verified=1 WHERE username='${req.body.school_admin}' AND user_role='school-admin';`,
      async function (error, results, fields) {
        if (error)
          return res.status(500).json({
            status: "failed",
            message: error.message,
          });
        console.log(results);

        if (results.affectedRows == 0) {
          return res.status(400).json({
            status: "failed",
            message: "There is no school admin with this username!",
          });
        }

        return res.status(200).json({
          status: "success",
          message: "The school admin is now successfully verified!",
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

exports.selectAllBooks = async (req, res, next) => {
    try {
  
      let connection = sql.createConnection(config);
      connection.connect();
  
      connection.query(
        `SET @school_ID=(SELECT ID FROM School WHERE school_name='${req.params.schoolName}');` +
        `SELECT title FROM book WHERE school_ID = @school_ID;`,
        async function (error, results, fields) {
          if (error)
            return res.status(500).json({
              status: "failed",
              message: error.message,
            });
  
          return res.status(200).json({
            status: "success",
            books: results,
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