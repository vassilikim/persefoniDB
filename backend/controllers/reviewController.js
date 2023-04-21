var config = require("../dbconfig");
const sql = require("mysql");

exports.createReview = async (req, res, next) => {
  try {
    if (!req.body.book || !req.body.review || !req.body.rating) {
      return res.status(400).json({
        status: "failed",
        message: "The book title, review and rating can't be blank!",
      });
    }

    let connection = sql.createConnection(config);
    connection.connect();

    connection.query(
      `SELECT make_review('${req.body.book}', ${req.school_id}, ${req.user_id}, '${req.body.review}', ${req.body.rating}) as answer;`,
      async function (error, results, fields) {
        if (error)
          return res.status(500).json({
            status: "failed",
            message: error.message,
          });

        if (results[0]["answer"] == "OK") {
          return res.status(200).json({
            status: "success",
            message:
              req.role == "teacher"
                ? "Your review for this this book was successfully submitted!"
                : "Your review for this this book was successfully submitted! Please wait for it to get verified!",
          });
        } else if (results[0]["answer"] == "NO BOOK") {
          return res.status(400).json({
            status: "failed",
            message:
              "The requested book title does not exist in your school library!",
          });
        } else if (results[0]["answer"] == "NO LENDING") {
          return res.status(403).json({
            status: "failed",
            message:
              "You can't submit a review for a book you have not lended!",
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

exports.getNotVerifedReviews = async (req, res, next) => {
  try {
    let connection = sql.createConnection(config);
    connection.connect();

    connection.query(
      `SELECT r.*, v.username, b.title 
      FROM Review r 
      JOIN verifiedUsers v
      JOIN Book b 
      ON r.user_ID=v.ID AND r.book_ID=b.ID 
      WHERE r.verified=0 AND v.school_ID=${req.school_id} AND v.user_role='student';`,
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

exports.verifyStudentReview = async (req, res, next) => {
  try {
    if (!req.body.book || !req.body.student) {
      return res.status(400).json({
        status: "failed",
        message: "Please choose which review you want to verify.",
      });
    }

    let connection = sql.createConnection(config);
    connection.connect();

    connection.query(
      `UPDATE Review r 
      JOIN verifiedUsers v
      JOIN Book b 
      ON r.user_ID=v.ID AND r.book_ID=b.ID
      SET r.verified=1
      WHERE v.username='${req.body.student}' AND v.user_role='student' AND b.title='${req.body.book}';`,
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
              "There is no not verified review for this book from this student!",
          });
        }

        return res.status(200).json({
          status: "success",
          message: "The review is now successfully verified!",
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
