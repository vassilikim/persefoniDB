var config = require("../dbconfig");
const sql = require("mysql");

exports.getMainPage = async (req, res, next) => {
  if (req.role == "super-admin") {
    res.status(200).render("super-admin");
  } else if (req.role == "school-admin") {
    res.status(200).render("school-admin");
  } else if (req.role == "teacher" || req.role == "student") {
    res.status(200).render("users");
  }
};

exports.getSignUp = async (req, res, next) => {
  res.status(200).render("signup");
};

exports.getLoginPage = async (req, res, next) => {
  res.status(200).render("login");
};

exports.getChangePassword = async (req, res, next) => {
  res.status(200).render("change-password");
};

exports.getSchools = async (req, res, next) => {
  res.status(200).render("schools");
};

exports.getEditProfile = async (req, res, next) => {
  res.status(200).render("edit-profile");
};

exports.getNotVerifiedSchoolAdmins = async (req, res, next) => {
  res.status(200).render("verify-admin");
};

exports.getNotVerifiedTeachersStudents = async (req, res, next) => {
  res.status(200).render("verify-teachers-students");
};

exports.getEditSchool = async (req, res, next) => {
  res.status(200).render("edit-school", req.query);
};

exports.getEditBook = async (req, res, next) => {
  res.status(200).render("edit-book", req.query);
};

exports.getAddSchool = async (req, res, next) => {
  res.status(200).render("add-school");
};

exports.getAddBook = async (req, res, next) => {
  res.status(200).render("add-book");
};

exports.getLendingRequests = async (req, res, next) => {
  res.status(200).render("lending-requests");
};

exports.getMyLendingRequests = async (req, res, next) => {
  res.status(200).render("my-lending-requests");
};

exports.getLendings = async (req, res, next) => {
  res.status(200).render("lendings");
};

exports.getMyLendings = async (req, res, next) => {
  res.status(200).render("my-lendings");
};

exports.getPendingReservations = async (req, res, next) => {
  res.status(200).render("pending-reservations");
};

exports.getMakeReview = async (req, res, next) => {
  res.status(200).render("make-review", req.query);
};

exports.getBorrowInSchool = async (req, res, next) => {
  res.status(200).render("borrow-in-school");
};

exports.getDelayedLendings = async (req, res, next) => {
  res.status(200).render("delayed-lendings");
};

exports.getBooks = async (req, res, next) => {
  res.status(200).render("books");
};

exports.getUserBooks = async (req, res, next) => {
  res.status(200).render("user-books");
};

exports.getUsers = async (req, res, next) => {
  res.status(200).render("handle-users");
};

exports.getStudentReviews = async (req, res, next) => {
  res.status(200).render("verify-reviews");
};

exports.getQueries = async (req, res, next) => {
  res.status(200).render("superAdminQueries");
};

exports.getLendingsPerSchool = async (req, res, next) => {
  res.status(200).render("lendings-per-school");
};

exports.getWritersTeachersGenre = async (req, res, next) => {
  res.status(200).render("writers-teachers-genre");
};

exports.getYoungTeachersMaxBooks = async (req, res, next) => {
  res.status(200).render("young-teachers-max-books");
};

exports.getWritersNoLendings = async (req, res, next) => {
  res.status(200).render("writers-no-lendings");
};

exports.getSchoolAdminsSameLendings = async (req, res, next) => {
  res.status(200).render("school-admins-same-lendings");
};

exports.getTop3GenrePairs = async (req, res, next) => {
  res.status(200).render("top3-genre-pairs");
};

exports.getWriters5LessThanMax = async (req, res, next) => {
  res.status(200).render("writers-5-less-than-max");
};

exports.getAverageRatingGenresUsers = async (req, res, next) => {
  res.status(200).render("average-rating-genres-users");
};

exports.getProfile = async (req, res, next) => {
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

        res.status(200).render("profile", {
          firstname: req.first_name,
          lastname: req.last_name,
          username: req.username,
          role: req.role,
          school: results[0] ? results[0]["school_name"] : "NULL",
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
