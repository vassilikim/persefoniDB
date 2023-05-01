var config = require("../dbconfig");
const sql = require("mysql");

exports.selectAllBooks = async (req, res, next) => {
  try {
    if (req.query.copies && req.role != "school-admin") {
      return res.status(403).json({
        status: "failed",
        message: "You are not allowed to search for books by number of copies!",
      });
    }

    if (!req.query.title) {
      req.query.title = null;
    } else req.query.title = `'${req.query.title}'`;
    if (!req.query.genre) {
      req.query.genre = null;
    } else req.query.genre = `'${req.query.genre}'`;
    if (!req.query.writer) {
      req.query.writer = null;
    } else req.query.writer = `'${req.query.writer}'`;
    if (!req.query.copies || req.role != "school-admin") {
      req.query.copies = null;
    }

    let connection = sql.createConnection(config);
    connection.connect();

    connection.query(
      `CALL selectBooks(${req.school_id}, ${req.query.title}, ${req.query.genre}, ${req.query.writer}, ${req.query.copies});`,
      async function (error, results, fields) {
        if (error)
          return res.status(500).json({
            status: "failed",
            message: error.message,
          });

        return res.status(200).json({
          status: "success",
          books: results[0],
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

exports.selectLendedBooks = async (req, res, next) => {
  try {
    let connection = sql.createConnection(config);
    connection.connect();

    connection.query(
      `CALL selectLendedBooks(${req.user_id});`,
      async function (error, results, fields) {
        if (error)
          return res.status(500).json({
            status: "failed",
            message: error.message,
          });

        return res.status(200).json({
          status: "success",
          books: results[0],
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
