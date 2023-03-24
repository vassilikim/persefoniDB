var config = require("../dbconfig");
const sql = require("mysql");
const fs = require("fs");

exports.backup = async (req, res, next) => {
  try {
    var connection = sql.createConnection(config);

    connection.connect();

    fs.unlinkSync(process.env.PATH_FOR_BACKUP);
    connection.query(
      `SELECT * FROM payment INTO OUTFILE '${process.env.PATH_FOR_BACKUP}'`,
      function (error, results, fields) {
        if (error) throw error;
        return res.status(200).json({
          status: "success",
          results: results,
        });
      }
    );

    connection.end();
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      status: "failed",
      message: error.message,
    });
  }
};

exports.restore = async (req, res, next) => {
  try {
    var connection = sql.createConnection(config);

    connection.connect();
    connection.query("TRUNCATE payment");

    connection.query(
      `LOAD DATA INFILE '${process.env.PATH_FOR_BACKUP}' INTO TABLE payment`,
      function (error, results, fields) {
        if (error) throw error;
        return res.status(200).json({
          status: "success",
          results: results,
        });
      }
    );

    connection.end();
  } catch (error) {
    return res.status(500).json({
      status: "failed",
      message: error.message,
    });
  }
};
