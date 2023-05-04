var config = require("../dbconfig");
const sql = require("mysql");

function monthToNumber(monthName) {
  const months = {
    january: 1,
    february: 2,
    march: 3,
    april: 4,
    may: 5,
    june: 6,
    july: 7,
    august: 8,
    september: 9,
    october: 10,
    november: 11,
    december: 12,
  };

  const normalizedMonthName = monthName.toLowerCase();

  if (months.hasOwnProperty(normalizedMonthName)) {
    return months[normalizedMonthName];
  } else {
    return null;
  }
}

exports.getNotVerifiedSchoolAdmins = async (req, res, next) => {
  try {
    let connection = sql.createConnection(config);
    connection.connect();

    connection.query(
      `SELECT u.*, s.school_name FROM activeUsers u JOIN School s ON u.school_ID=s.ID WHERE user_role='school-admin' AND verified=0;`,
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

exports.verifySchoolAdmin = async (req, res, next) => {
  try {
    if (!req.body.school_admin) {
      return res.status(400).json({
        status: "failed",
        message: "Please choose which school admin you want to verify.",
      });
    }

    let connection = sql.createConnection(config);
    connection.connect();

    connection.query(
      `UPDATE Users SET verified=1 WHERE username='${req.body.school_admin}' 
      AND user_role='school-admin' AND verified=0;`,
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
              "There is no not verified school admin with this username!",
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

exports.getNumOfLendingsPerSchool = async (req, res, next) => {
  try {
    if (!req.query.year) req.query.year = null;
    if (!req.query.month) req.query.month = null;
    else if ((month = monthToNumber(req.query.month)) != null) {
      req.query.month = month;
    } else {
      return res.status(400).json({
        status: "failed",
        message: "Please provide a valid month name!",
      });
    }

    let connection = sql.createConnection(config);
    connection.connect();

    connection.query(
      `CALL get_lendings_by_school(${req.query.year}, ${req.query.month})`,
      async function (error, results, fields) {
        if (error)
          return res.status(500).json({
            status: "failed",
            message: error.message,
          });

        return res.status(200).json({
          status: "success",
          data: results[0],
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

exports.getWritersTeachersPerGenre = async (req, res, next) => {
  try {
    if (!req.query.genre)
      return res.status(400).json({
        status: "failed",
        message: "Please provide the genre in the parameters!",
      });

    let connection = sql.createConnection(config);
    connection.connect();

    connection.query(
      `CALL get_writers_teachers_per_genre('${req.query.genre}')`,
      async function (error, results, fields) {
        if (error)
          return res.status(500).json({
            status: "failed",
            message: error.message,
          });

        return res.status(200).json({
          status: "success",
          teachers: results[0],
          writers: results[1],
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

exports.getYoungTeachersWithMaxBooks = async (req, res, next) => {
  try {
    let connection = sql.createConnection(config);
    connection.connect();

    connection.query(
      `CALL get_young_teachers_max_books()`,
      async function (error, results, fields) {
        if (error)
          return res.status(500).json({
            status: "failed",
            message: error.message,
          });

        return res.status(200).json({
          status: "success",
          data: results[0],
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

exports.getWritersWithNoLendings = async (req, res, next) => {
  try {
    let connection = sql.createConnection(config);
    connection.connect();

    connection.query(
      `CALL get_writers_no_lendings()`,
      async function (error, results, fields) {
        if (error)
          return res.status(500).json({
            status: "failed",
            message: error.message,
          });

        return res.status(200).json({
          status: "success",
          data: results[0],
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

exports.getSchoolAdminsWithSameLendings = async (req, res, next) => {
  try {
    let connection = sql.createConnection(config);
    connection.connect();

    connection.query(
      `CALL get_schooladmins_same_lendings()`,
      async function (error, results, fields) {
        if (error)
          return res.status(500).json({
            status: "failed",
            message: error.message,
          });

        return res.status(200).json({
          status: "success",
          data: results[0],
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

exports.getTop3GenrePairs = async (req, res, next) => {
  try {
    let connection = sql.createConnection(config);
    connection.connect();

    connection.query(
      `CALL get_top3_genre_pairs()`,
      async function (error, results, fields) {
        if (error)
          return res.status(500).json({
            status: "failed",
            message: error.message,
          });

        return res.status(200).json({
          status: "success",
          data: results[0],
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

exports.getWritersWith5BooksLessThanMax = async (req, res, next) => {
  try {
    let connection = sql.createConnection(config);
    connection.connect();

    connection.query(
      `CALL get_writers_5_less_than_max()`,
      async function (error, results, fields) {
        if (error)
          return res.status(500).json({
            status: "failed",
            message: error.message,
          });

        return res.status(200).json({
          status: "success",
          data: results[0],
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
