var config = require("../dbconfig");
const sql = require("mysql");

exports.createPendingReservation = async (req, res, next) => {
  try {
    if (!req.body.book) {
      return res.status(400).json({
        status: "failed",
        message: "The book title can't be blank!",
      });
    }

    let connection = sql.createConnection(config);
    connection.connect();

    connection.query(
      `SELECT pending_reservation('${req.body.book}', ${req.school_id}, ${req.user_id}, '${req.role}') as answer;`,
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
              "Your request for lending this book was successfully submitted!",
          });
        } else if (results[0]["answer"] == "ALREADY RESERVATION") {
          return res.status(403).json({
            status: "failed",
            message: "You have already submitted a reservation for this book!",
          });
        } else if (results[0]["answer"] == "ALREADY LENDING") {
          return res.status(403).json({
            status: "failed",
            message:
              "You can't make a request to lend a book you have not yet returned!",
          });
        } else if (results[0]["answer"] == "DELAY") {
          return res.status(403).json({
            status: "failed",
            message:
              "You have delayed the return of a book! Please return it first before lending another!",
          });
        } else if (results[0]["answer"] == "TOO MANY") {
          return res.status(403).json({
            status: "failed",
            message:
              "You have exceeded the maximum number of reservations for this week!",
          });
        } else if (results[0]["answer"] == "NO BOOK") {
          return res.status(400).json({
            status: "failed",
            message:
              "The requested book title does not exist in your school library!",
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
