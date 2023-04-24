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

exports.selectAllSchools = async (req, res, next) => {
  try {

    let connection = sql.createConnection(config);
    connection.connect();

    connection.query(
      `SELECT school_name FROM school;`,
      async function (error, results, fields) {
        if (error)
          return res.status(500).json({
            status: "failed",
            message: error.message,
          });

        return res.status(200).json({
          status: "success",
          schools: results,
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

exports.addSchool = async (req, res, next) => {
  try {

    if (!req.body.school_name || !req.body.address || !req.body.city || !req.body.phone || !req.body.email || !req.body.principal) {
      return res.status(500).json({
        status: "failed",
        message: "Please provide all the required parameters.",
      });
    }
    console.log(req.body.school_active);
    if (!req.body.school_active) {
      req.body.school_active = 0;
      console.log(req.body.school_active);
    }
    let connection = sql.createConnection(config);
    connection.connect();

    
    connection.query(
      `INSERT INTO school (school_name, address, city, phone, email, principal, school_active)` + `VALUES ('${req.body.school_name}', '${req.body.address}', '${req.body.city}', '${req.body.phone}', '${req.body.email}', '${req.body.principal}', ${req.body.school_active});`,
      async function (error, results, fields) {
        if (error)
          return res.status(500).json({
            status: "failed",
            message: error.message,
          });

        return res.status(200).json({
          status: "success",
          message: "New school added successfully",
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

exports.updateSchool = async (req, res, next) => {
  try {

    if (!req.body.school_name || !req.body.address || !req.body.city || !req.body.phone || !req.body.email || !req.body.principal || (req.body.school_active != 0 && req.body.school_active != 1)) {
      return res.status(500).json({
        status: "failed",
        message: "Please provide all the required parameters.",
      });
    }
    console.log(req.params.schoolID);

    let connection = sql.createConnection(config);
    connection.connect();

    connection.query(
      `UPDATE school SET school_name = '${req.body.school_name}', address = '${req.body.address}', city = '${req.body.city}', phone = '${req.body.phone}', email = '${req.body.email}', principal = '${req.body.principal}', school_active = ${req.body.school_active} WHERE ID = ${req.params.schoolID};`,
      async function (error, results, fields) {
        if (error)
          return res.status(500).json({
            status: "failed",
            message: error.message,
          });

        if (results.affectedRows == 0) {
          return res.status(400).json({
            status: "failed",
            message: "There is no school with this name!",
          });
        }

        return res.status(200).json({
          status: "success",
          schools: "The School was updated successfully!",
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

exports.deleteSchool = async (req, res, next) => {
  try {

    let connection = sql.createConnection(config);
    connection.connect();

    connection.query(
      //`SET @tab=SELECT ID FROM book WHERE school_ID=${req.params.schoolID};`, 
      // `SELECT * FROM @tab;`,
      // `DELETE FROM school WHERE ID=${req.params.schoolID};`,
      `SELECT * FROM review WHERE book_ID IN (SELECT ID FROM book WHERE school_ID=${req.params.schoolID});` +
      `SELECT * FROM reservation WHERE book_ID IN (SELECT ID FROM book WHERE school_ID=${req.params.schoolID});` +
      `SELECT * FROM lending WHERE book_ID IN (SELECT ID FROM book WHERE school_ID=${req.params.schoolID});` + 
      `SELECT * FROM genre WHERE book_ID IN (SELECT ID FROM book WHERE school_ID=${req.params.schoolID});` +
      `SELECT ID FROM user WHERE school_ID=${req.params.schoolID};` +
      `SELECT * FROM writer WHERE writer_ID IN (SELECT writer_ID FROM writes WHERE book_ID IN (SELECT ID FROM book WHERE school_ID=${req.params.schoolID}));` +
      `SELECT * FROM writes WHERE book_ID IN (SELECT ID FROM book WHERE school_ID=${req.params.schoolID});` +
      `SELECT ID FROM book WHERE school_ID=${req.params.schoolID}` +
      `DELETE FROM school WHERE ID=${req.params.schoolID};`,
      async function (error, results, fields) {
        if (error)
          return res.status(500).json({
            status: "failed",
            message: error.message,
          });

        if (results.affectedRows == 0) {
          return res.status(400).json({
            status: "failed",
            message: "There is no school with this name!",
          });
        }
        return res.status(200).json({
          status: "success",
          message: results,
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

exports.selectAllBooks = async (req, res, next) => {
  try {
    
    let connection = sql.createConnection(config);
    connection.connect();

    connection.query(
      `SELECT title FROM book WHERE school_ID=${req.params.schoolID};` +
      `SELECT ID FROM book WHERE school_ID=${req.params.schoolID};`,
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

exports.addBook = async (req, res, next) => {
  try {

    if (!req.body.title || !req.body.publisher || !req.body.ISBN || !req.body.page_number || !req.body.summary || !req.body.copies || !req.body.image || !req.body.lang || !req.body.keywords || !req.body.school_ID || !req.body.genre || !req.body.first_name || !req.body.last_name) {
      return res.status(500).json({
        status: "failed",
        message: "Please provide all the required parameters.",
      });
    }
    
    let connection = sql.createConnection(config);
    connection.connect();

    
    connection.query(
      `INSERT INTO book (title, publisher, ISBN, page_number, summary, copies, image, lang, keywords, school_ID)` + `VALUES ('${req.body.title}', '${req.body.publisher}', '${req.body.ISBN}', ${req.body.page_number}, '${req.body.summary}', ${req.body.copies}, '${req.body.image}', '${req.body.lang}', '${req.body.keywords}', ${req.body.school_ID});` +
      //`SELECT ID FROM book WHERE ID = LAST_INSERT_ID();`,
      `SET @bookID=(SELECT ID FROM book WHERE ID = LAST_INSERT_ID());` +
      `INSERT INTO genre (book_ID, genre)` + `VALUES (@bookID, '${req.body.genre}');` +
      `INSERT INTO writer (first_name, last_name)` + `VALUES ('${req.body.first_name}', '${req.body.last_name}');` +
      `SET @writerID=(SELECT ID FROM writer WHERE ID = LAST_INSERT_ID());` +
      `INSERT INTO writes (writer_ID, book_ID)` + `VALUES (@writerID, @bookID);`,
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