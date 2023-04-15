var config = require("../dbconfig");
const sql = require("mysql");

exports.createReservation = async (req, res, next) => {
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
      `SELECT make_reservation('${req.body.book}', ${req.school_id}, ${req.user_id}, '${req.role}') as answer;`,
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

exports.getAllReservations = async (req, res, next) => {
  try {
    let connection = sql.createConnection(config);
    connection.connect();

    connection.query(
      `SELECT r.*, v.username, v.user_role, b.title 
      FROM Reservation r 
      JOIN verifiedUsers v
      JOIN Book b 
      ON r.user_ID=v.ID AND r.book_ID=b.ID 
      WHERE r.reservation_status=0 AND v.school_ID=${req.school_id};`,
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

exports.getAllPendingReservations = async (req, res, next) => {
  try {
    let connection = sql.createConnection(config);
    connection.connect();

    connection.query(
      `SELECT r.*, v.username, v.user_role, b.title 
      FROM Reservation r 
      JOIN verifiedUsers v
      JOIN Book b 
      ON r.user_ID=v.ID AND r.book_ID=b.ID 
      WHERE r.reservation_status=1 AND v.school_ID=${req.school_id};`,
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

exports.handleReservation = async (req, res, next) => {
  try {
    if (!req.body.book || !req.body.username) {
      return res.status(400).json({
        status: "failed",
        message: "The book title and user's username can't be blank!",
      });
    }

    let connection = sql.createConnection(config);
    connection.connect();

    connection.query(
      `SELECT handle_reservation('${req.body.book}', ${req.school_id}, '${req.body.username}') as answer;`,
      async function (error, results, fields) {
        if (error)
          return res.status(500).json({
            status: "failed",
            message: error.message,
          });

        if (results[0]["answer"] == "OK") {
          return res.status(200).json({
            status: "success",
            message: "The book lending was successfully submitted!",
          });
        } else if (results[0]["answer"] == "ALREADY LENDING") {
          return res.status(403).json({
            status: "failed",
            message: "You already have this book lended!",
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
              "You have exceeded the maximum number of lendings for this week!",
          });
        } else if (results[0]["answer"] == "NO BOOK") {
          return res.status(400).json({
            status: "failed",
            message:
              "The requested book title does not exist in your school library!",
          });
        } else if (results[0]["answer"] == "NO USER") {
          return res.status(400).json({
            status: "failed",
            message:
              "There is no verified teacher/student with this username in your school!",
          });
        } else if (results[0]["answer"] == "NO COPY, UPDATED TO PENDING") {
          return res.status(400).json({
            status: "failed",
            message:
              "There is no copy of this book available. Your reservation will be served once such a copy is returned!",
          });
        } else if (results[0]["answer"] == "NO COPY") {
          return res.status(400).json({
            status: "failed",
            message:
              "There is no copy of this book available. Please make a reservation for it online!",
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

exports.returnBook = async (req, res, next) => {
  try {
    if (!req.body.book || !req.body.username) {
      return res.status(400).json({
        status: "failed",
        message: "The book title and user's username can't be blank!",
      });
    }

    let connection = sql.createConnection(config);
    connection.connect();

    connection.query(
      `SELECT return_book('${req.body.book}', ${req.school_id}, '${req.body.username}') as answer;`,
      async function (error, results, fields) {
        if (error)
          return res.status(500).json({
            status: "failed",
            message: error.message,
          });

        if (results[0]["answer"] == "OK") {
          return res.status(200).json({
            status: "success",
            message: "The book return was successfully submitted!",
          });
        } else if (results[0]["answer"] == "NO LENDING") {
          return res.status(403).json({
            status: "failed",
            message: "This user does not have a pending lending for this book!",
          });
        } else if (results[0]["answer"] == "NO BOOK") {
          return res.status(400).json({
            status: "failed",
            message:
              "The requested book title does not exist in your school library!",
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
