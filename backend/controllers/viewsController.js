var config = require("../dbconfig");
const sql = require("mysql");

exports.getMainPage = async (req, res, next) => {
  if (req.role == "super-admin") {
    res.status(200).render("super-admin");
  } else if (req.role == "school-admin"){
    res.status(200).render("school-admin");
  }
};

exports.getLoginPage = async (req, res, next) => {
  res.status(200).render("login");
};

exports.getProfile=async(req,res,next)=>{
  try {
    let connection = sql.createConnection(config);
    connection.connect();

    connection.query(
      `SELECT school_name FROM School WHERE ID=${req.school_id} AND school_active=1;`,
      async function (error, results, fields) {
        if (error)
          return res.status(500).json({
            status: "failed",
            message: error.message,
          });

          res.status(200).render("profile",{
            firstname:req.first_name,
            lastname:req.last_name,
            username:req.username,
            role:req.role,
            school:results[0] ?results[0]['school_name']:"NULL"
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

