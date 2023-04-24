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
      `INSERT INTO school (school_name, address, city, phone, email, principal, school_active)` + `VALUES ('${req.body.school_name}', '${req.body.address}', '${req.body.city}', '${req.body.phone}', '${req.body.email}', '${req.body.principal}', ${req.body.school_active})`,
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

    if (req.body.school_active != 0 && req.body.school_active != 1) {
      console.log(req.body.school_active);
    }

    let connection = sql.createConnection(config);
    connection.connect();

    connection.query(
      `UPDATE school SET school_name = '${req.body.school_name}', address = '${req.body.address}', city = '${req.body.city}', phone = '${req.body.phone}', email = '${req.body.email}', principal = '${req.body.principal}', school_active = ${req.body.school_active} WHERE school_name = '${req.params.schoolName}';`,
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
      `DELETE FROM school WHERE school_name='${req.params.schoolName}';`,
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
          message: "Deleted successfully",
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