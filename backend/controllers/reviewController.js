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
