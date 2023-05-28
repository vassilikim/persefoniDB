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

exports.addBook = async (req, res, next) => {
  try {
    if (
      !req.body.title ||
      !req.body.publisher ||
      !req.body.ISBN ||
      !req.body.page_number ||
      !req.body.summary ||
      !req.body.copies ||
      !req.body.image ||
      !req.body.lang ||
      !req.body.keywords ||
      !req.body.genre ||
      !req.body.writer_name
    ) {
      return res.status(400).json({
        status: "failed",
        message: "Please provide all the required parameters.",
      });
    }

    let connection = sql.createConnection(config);
    connection.connect();

    connection.query(
      `INSERT INTO book (title, publisher, ISBN, page_number, summary, copies, image, lang, keywords, school_ID)` +
        `VALUES ('${req.body.title}', '${req.body.publisher}', '${req.body.ISBN}', ${req.body.page_number}, '${req.body.summary}', ${req.body.copies}, '${req.body.image}', '${req.body.lang}', '${req.body.keywords}', ${req.school_id});` +
        `SET @bookID=(SELECT ID FROM book WHERE ID = LAST_INSERT_ID());` +
        `CALL extract_names_genre('${req.body.writer_name}', '${req.body.genre}', @bookID)`,
      async function (error, results, fields) {
        if (error)
          return res.status(500).json({
            status: "failed",
            message: error.message,
          });

        return res.status(200).json({
          status: "success",
          message: "New book added successfully",
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

exports.updateBook = async (req, res, next) => {
  try {
    if (
      !req.body.publisher ||
      !req.body.ISBN ||
      !req.body.page_number ||
      !req.body.summary ||
      !req.body.copies ||
      !req.body.image ||
      !req.body.lang ||
      !req.body.keywords ||
      !req.body.genre ||
      !req.body.writer_name
    ) {
      return res.status(400).json({
        status: "failed",
        message: "Please provide all the required parameters.",
      });
    }

    let connection = sql.createConnection(config);
    connection.connect();

    connection.query(
      `SELECT UpdateBook(${req.params.bookID}, ${req.school_id}, '${req.body.publisher}', '${req.body.ISBN}', ${req.body.page_number}, '${req.body.summary}', ${req.body.copies}, '${req.body.image}', '${req.body.lang}', '${req.body.keywords}') as answer;`,
      async function (error, results, fields) {
        if (error)
          return res.status(500).json({
            status: "failed",
            message: error.message,
          });

        if (results[0]["answer"] == "NO BOOK") {
          return res.status(400).json({
            status: "failed",
            message: "There is no book with this ID in your school!",
          });
        } else {
          let connection1 = sql.createConnection(config);
          connection1.connect();
          connection1.query(
            `CALL extract_names_genre('${req.body.writer_name}', '${req.body.genre}', ${req.params.bookID})`,
            async function (error, results, fields) {
              if (error)
                return res.status(500).json({
                  status: "failed",
                  message: error.message,
                });
              return res.status(200).json({
                status: "success",
                message: "The book was updated successfully!",
              });
            }
          );
          connection1.end();
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

exports.deleteBook = async (req, res, next) => {
  try {
    let connection = sql.createConnection(config);
    connection.connect();

    connection.query(
      `SELECT delBook(${req.params.bookID}, ${req.school_id}) as answer;`,
      async function (error, results, fields) {
        if (error)
          return res.status(500).json({
            status: "failed",
            message: error.message,
          });

        if (results[0]["answer"] == "NO BOOK") {
          return res.status(400).json({
            status: "failed",
            message: "There is no book with this ID in your school!",
          });
        } else {
          return res.status(200).json({
            status: "success",
            message: "This book was deleted successfully",
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
