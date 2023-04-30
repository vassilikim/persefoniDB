var config = require("../dbconfig");
const sql = require("mysql");

exports.selectAllSchools = async (req, res, next) => {
  try {
    let connection = sql.createConnection(config);
    connection.connect();

    connection.query(
      `SELECT * FROM School;`,
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
    if (
      !req.body.school_name ||
      !req.body.address ||
      !req.body.city ||
      !req.body.phone ||
      !req.body.email ||
      !req.body.principal
    ) {
      return res.status(400).json({
        status: "failed",
        message: "Please provide all the required parameters.",
      });
    }

    let connection = sql.createConnection(config);
    connection.connect();

    connection.query(
      `INSERT INTO School (school_name, address, city, phone, email, principal)` +
        `VALUES ('${req.body.school_name}', '${req.body.address}', '${req.body.city}', '${req.body.phone}', '${req.body.email}', '${req.body.principal}');`,
      async function (error, results, fields) {
        if (error)
          return res.status(500).json({
            status: "failed",
            message: error.message,
          });

        return res.status(201).json({
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
    if (
      !req.body.school_name ||
      !req.body.address ||
      !req.body.city ||
      !req.body.phone ||
      !req.body.email ||
      !req.body.principal
    ) {
      return res.status(400).json({
        status: "failed",
        message: "Please provide all the required parameters.",
      });
    }

    let connection = sql.createConnection(config);
    connection.connect();

    connection.query(
      `UPDATE School SET school_name = '${req.body.school_name}', address = '${req.body.address}', city = '${req.body.city}', phone = '${req.body.phone}', email = '${req.body.email}', principal = '${req.body.principal}' WHERE ID = ${req.params.schoolID};`,
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
          schools: "The school was updated successfully!",
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
      `SELECT DelSchool(${req.params.schoolID}) AS answer;`,
      async function (error, results, fields) {
        if (error)
          return res.status(500).json({
            status: "failed",
            message: error.message,
          });

        if (results[0]["answer"] == "NOT OK") {
          return res.status(400).json({
            status: "failed",
            message: "There is no school with this ID!",
          });
        } else {
          return res.status(200).json({
            status: "success",
            message: "The school was deleted successfully ",
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
