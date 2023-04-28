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

///////////////////////////////////////// school admin ////////////////////////////////////////////

// exports.selectAllBooks = async (req, res, next) => {
//   try {
    
//     let connection = sql.createConnection(config);
//     connection.connect();

//     connection.query(
//       // `SELECT title FROM book WHERE school_ID=${req.school_id};`,
//       `SELECT * FROM book WHERE school_ID=${req.params.schoolID};`,
//       async function (error, results, fields) {
//         if (error)
//           return res.status(500).json({
//             status: "failed",
//             message: error.message,
//           });

//         return res.status(200).json({
//           status: "success",
//           books: results,
//         });
//       }
//     );
//     connection.end();
//   } catch (err) {
//     return res.status(500).json({
//       status: "failed",
//       message: err.message,
//     });
//   }
// };

// exports.addBook = async (req, res, next) => {
//   try {

//     if (!req.body.title || !req.body.publisher || !req.body.ISBN || !req.body.page_number || !req.body.summary || !req.body.copies || !req.body.image || !req.body.lang || !req.body.keywords || !req.body.school_ID || !req.body.genre || !req.body.first_name || !req.body.last_name) {
//       return res.status(500).json({
//         status: "failed",
//         message: "Please provide all the required parameters.",
//       });
//     }
    
//     let connection = sql.createConnection(config);
//     connection.connect();

    
//     connection.query(
//       `INSERT INTO book (title, publisher, ISBN, page_number, summary, copies, image, lang, keywords, school_ID)` + `VALUES ('${req.body.title}', '${req.body.publisher}', '${req.body.ISBN}', ${req.body.page_number}, '${req.body.summary}', ${req.body.copies}, '${req.body.image}', '${req.body.lang}', '${req.body.keywords}', ${req.body.school_ID});` +
//       //`SELECT ID FROM book WHERE ID = LAST_INSERT_ID();`,
//       `SET @bookID=(SELECT ID FROM book WHERE ID = LAST_INSERT_ID());` +
//       `INSERT INTO genre (book_ID, genre)` + `VALUES (@bookID, '${req.body.genre}');` +
//       `INSERT INTO writer (first_name, last_name)` + `VALUES ('${req.body.first_name}', '${req.body.last_name}');` +
//       `SET @writerID=(SELECT ID FROM writer WHERE ID = LAST_INSERT_ID());` +
//       `INSERT INTO writes (writer_ID, book_ID)` + `VALUES (@writerID, @bookID);`,
//       async function (error, results, fields) {
//         if (error)
//           return res.status(500).json({
//             status: "failed",
//             message: error.message,
//           });

//         return res.status(200).json({
//           status: "success",
//           message: "New book added successfully",
//         });
//       }
//     );
//     connection.end();
//   } catch (err) {
//     return res.status(500).json({
//       status: "failed",
//       message: err.message,
//     });
//   }
// };