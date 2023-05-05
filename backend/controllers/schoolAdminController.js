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
      `CALL selectBooks(${req.school_id});`,
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
          return res.status(401).json({
            status: "failed",
            message: "There is no book with this ID!",
            });
        } else if (results[0]["answer"] == "NOT OK"){
          return res.status(403).json({
            status: "failed",
            message: "You don't have permission to perform this action!",
          });
        } else {
          return res.status(200).json({
            status: "success",
            message: "This book was deleted successfully"
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

exports.selectAllReservations = async (req, res, next) => {
  try {

    let connection = sql.createConnection(config);
    connection.connect();

    connection.query(
      `CALL SelectReservations(${req.school_id});`,
      async function (error, results, fields) {
        if (error)
          return res.status(500).json({
            status: "failed",
            message: error.message,
          });

        return res.status(200).json({
          status: "success",
          reservations: results[0],
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

exports.selectAllLendings = async (req, res, next) => {
  try {

    let connection = sql.createConnection(config);
    connection.connect();

    connection.query(
      `CALL SelectLendings(${req.school_id});`,
      async function (error, results, fields) {
        if (error)
          return res.status(500).json({
            status: "failed",
            message: error.message,
          });

        return res.status(200).json({
          status: "success",
          lendings: results[0],
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

exports.selectResforUser = async (req, res, next) => {
  try {

    let connection = sql.createConnection(config);
    connection.connect();

    connection.query(
      `SELECT checkUser(${req.school_id}, ${req.params.userID}) as answer;`,
      async function (error, results, fields) {
        if (error)
          return res.status(500).json({
            status: "failed",
            message: error.message,
          });

        if (results[0]["answer"] == "NO USER") {
          return res.status(401).json({
            status: "failed",
            message: "There is no user with this ID!",
          });
        } else if (results[0]["answer"] == "NOT OK"){
          return res.status(403).json({
            status: "failed",
            message: "You don't have permission to perform this action!",
          });
        } else {
          let connection1 = sql.createConnection(config);
          connection1.connect();
          connection1.query(
            `CALL SelectReservationsfromUser(${req.params.userID});`,
            async function (error, results, fields) {
              if (error)
                return res.status(500).json({
                  status: "failed",
                  message: error.message,
                });
                return res.status(200).json({
                 status: "success",
                  reservations: results[0],
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

exports.selectLenforUser = async (req, res, next) => {
  try {

    let connection = sql.createConnection(config);
    connection.connect();

    connection.query(
      `SELECT checkUser(${req.school_id}, ${req.params.userID}) as answer;`,
      async function (error, results, fields) {
        if (error)
          return res.status(500).json({
            status: "failed",
            message: error.message,
          });

        if (results[0]["answer"] == "NO USER") {
          return res.status(401).json({
            status: "failed",
            message: "There is no user with this ID!",
          });
        } else if (results[0]["answer"] == "NOT OK"){
          return res.status(403).json({
            status: "failed",
            message: "You don't have permission to perform this action!",
          });
        } else {
          let connection1 = sql.createConnection(config);
          connection1.connect();
          connection1.query(
            `CALL SelectLendingsfromUser(${req.params.userID});`,
            async function (error, results, fields) {
              if (error)
                return res.status(500).json({
                  status: "failed",
                  message: error.message,
                });
                return res.status(200).json({
                 status: "success",
                 lendigs: results[0],
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

exports.selectDelayedLen = async (req, res, next) => {
  try {
    
    let connection = sql.createConnection(config);
    connection.connect();

    connection.query(
      `select * from lending where must_be_returned_at < now() and was_returned_at is null and book_ID IN (select ID from book where school_ID = ${req.school_id});`,
      async function (error, results, fields) {
        if (error)
          return res.status(500).json({
            status: "failed",
            message: error.message,
          });

        return res.status(200).json({
          status: "success",
          delayed_lendings: results,
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

    if (!req.body.title || !req.body.publisher || !req.body.ISBN || !req.body.page_number || !req.body.summary || !req.body.copies || !req.body.image || !req.body.lang || !req.body.keywords || !req.body.genre || !req.body.writer_name) {
      return res.status(500).json({
        status: "failed",
        message: "Please provide all the required parameters.",
      });
    }
    
    let connection = sql.createConnection(config);
    connection.connect();

    
    connection.query(
      `INSERT INTO book (title, publisher, ISBN, page_number, summary, copies, image, lang, keywords, school_ID)` + `VALUES ('${req.body.title}', '${req.body.publisher}', '${req.body.ISBN}', ${req.body.page_number}, '${req.body.summary}', ${req.body.copies}, '${req.body.image}', '${req.body.lang}', '${req.body.keywords}', ${req.school_id});` +
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

    if (!req.body.publisher || !req.body.ISBN || !req.body.page_number || !req.body.summary || !req.body.copies || !req.body.image || !req.body.lang || !req.body.keywords || !req.body.genre || !req.body.writer_name) {
      return res.status(500).json({
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
            return res.status(401).json({
              status: "failed",
              message: "There is no book with this ID!",
            });
          } else if (results[0]["answer"] == "NOT OK"){
            return res.status(403).json({
              status: "failed",
              message: "You don't have permission to perform this action!",
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
                   message: "The book was updated successfully!"
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