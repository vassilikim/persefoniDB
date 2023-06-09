var config = require("../dbconfig");
const sql = require("mysql");
const fs = require("fs");

exports.backup = async (req, res, next) => {
  try {
    var connection = sql.createConnection(config);

    connection.connect();
    if (fs.existsSync(process.env.PATH_FOR_BACKUP + "/schools.txt"))
      fs.unlinkSync(process.env.PATH_FOR_BACKUP + "/schools.txt");
    if (fs.existsSync(process.env.PATH_FOR_BACKUP + "/users.txt"))
      fs.unlinkSync(process.env.PATH_FOR_BACKUP + "/users.txt");
    if (fs.existsSync(process.env.PATH_FOR_BACKUP + "/books.txt"))
      fs.unlinkSync(process.env.PATH_FOR_BACKUP + "/books.txt");
    if (fs.existsSync(process.env.PATH_FOR_BACKUP + "/writers.txt"))
      fs.unlinkSync(process.env.PATH_FOR_BACKUP + "/writers.txt");
    if (fs.existsSync(process.env.PATH_FOR_BACKUP + "/writes.txt"))
      fs.unlinkSync(process.env.PATH_FOR_BACKUP + "/writes.txt");
    if (fs.existsSync(process.env.PATH_FOR_BACKUP + "/genres.txt"))
      fs.unlinkSync(process.env.PATH_FOR_BACKUP + "/genres.txt");
    if (fs.existsSync(process.env.PATH_FOR_BACKUP + "/reservations.txt"))
      fs.unlinkSync(process.env.PATH_FOR_BACKUP + "/reservations.txt");
    if (fs.existsSync(process.env.PATH_FOR_BACKUP + "/lendings.txt"))
      fs.unlinkSync(process.env.PATH_FOR_BACKUP + "/lendings.txt");
    if (fs.existsSync(process.env.PATH_FOR_BACKUP + "/reviews.txt"))
      fs.unlinkSync(process.env.PATH_FOR_BACKUP + "/reviews.txt");
    connection.query(
      `SELECT * FROM School INTO OUTFILE '${process.env.PATH_FOR_BACKUP}/schools.txt';` +
        `SELECT * FROM Users INTO OUTFILE '${process.env.PATH_FOR_BACKUP}/users.txt';` +
        `SELECT * FROM Book INTO OUTFILE '${process.env.PATH_FOR_BACKUP}/books.txt';` +
        `SELECT * FROM Writer INTO OUTFILE '${process.env.PATH_FOR_BACKUP}/writers.txt';` +
        `SELECT * FROM Writes INTO OUTFILE '${process.env.PATH_FOR_BACKUP}/writes.txt';` +
        `SELECT * FROM Genre INTO OUTFILE '${process.env.PATH_FOR_BACKUP}/genres.txt';` +
        `SELECT * FROM Reservation INTO OUTFILE '${process.env.PATH_FOR_BACKUP}/reservations.txt';` +
        `SELECT * FROM Lending INTO OUTFILE '${process.env.PATH_FOR_BACKUP}/lendings.txt';` +
        `SELECT * FROM Review INTO OUTFILE '${process.env.PATH_FOR_BACKUP}/reviews.txt';`,
      function (error, results, fields) {
        if (error)
          return res.status(500).json({
            status: "failed",
            message: error.message,
          });
        return res.status(200).json({
          status: "success",
          message: "The database was successfully backed up!",
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

    connection.query(
      `SET FOREIGN_KEY_CHECKS=0;` +
        `TRUNCATE Review; TRUNCATE Lending; TRUNCATE Reservation; TRUNCATE Genre; TRUNCATE Writes; TRUNCATE Writer; TRUNCATE Book; TRUNCATE Users; TRUNCATE School;` +
        `SET FOREIGN_KEY_CHECKS=1;` +
        `LOAD DATA INFILE '${process.env.PATH_FOR_BACKUP}/schools.txt' INTO TABLE School;` +
        `DROP TRIGGER hash_password_before_insert;` +
        `LOAD DATA INFILE '${process.env.PATH_FOR_BACKUP}/users.txt' INTO TABLE Users;` +
        `CREATE TRIGGER hash_password_before_insert BEFORE INSERT ON Users
        FOR EACH ROW
          BEGIN
	          SET NEW.user_password = SHA2(CONCAT('kimnamjoonkimseokjinminyoongijunghoseokparkjiminkimtaehyungjeonjungkookbts',
	          NEW.user_password), 256);
          END;` +
        `LOAD DATA INFILE '${process.env.PATH_FOR_BACKUP}/books.txt' INTO TABLE Book;` +
        `LOAD DATA INFILE '${process.env.PATH_FOR_BACKUP}/writers.txt' INTO TABLE Writer;` +
        `LOAD DATA INFILE '${process.env.PATH_FOR_BACKUP}/writes.txt' INTO TABLE Writes;` +
        `LOAD DATA INFILE '${process.env.PATH_FOR_BACKUP}/genres.txt' INTO TABLE Genre;` +
        `LOAD DATA INFILE '${process.env.PATH_FOR_BACKUP}/reservations.txt' INTO TABLE Reservation;` +
        `LOAD DATA INFILE '${process.env.PATH_FOR_BACKUP}/lendings.txt' INTO TABLE Lending;` +
        `LOAD DATA INFILE '${process.env.PATH_FOR_BACKUP}/reviews.txt' INTO TABLE Review;`,
      function (error, results, fields) {
        if (error)
          return res.status(500).json({
            status: "failed",
            message: error.message,
          });
        return res.status(200).json({
          status: "success",
          message:
            "The database was successfully restored to its backed up version",
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
