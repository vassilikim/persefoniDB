var express = require("express");
var router = express.Router();
var viewsController = require("../controllers/viewsController");
var authController = require("../controllers/authController");

router.get("/", viewsController.getLoginPage);
router.get("/main-screen", authController.protect, viewsController.getMainPage);
router.get("/profile", authController.protect, viewsController.getProfile);
router.get("/signup", viewsController.getSignUp);
router.get(
  "/change-password",
  authController.protect,
  viewsController.getChangePassword
);
router.get(
  "/edit-profile",
  authController.protect,
  authController.restrictTo("teacher"),
  viewsController.getEditProfile
);
router.get(
  "/schools",
  authController.protect,
  authController.restrictTo("super-admin"),
  viewsController.getSchools
);
router.get(
  "/verify-admin",
  authController.protect,
  authController.restrictTo("super-admin"),
  viewsController.getNotVerifiedSchoolAdmins
);
router.get(
  "/edit-school",
  authController.protect,
  authController.restrictTo("super-admin"),
  viewsController.getEditSchool
);
router.get(
  "/add-school",
  authController.protect,
  authController.restrictTo("super-admin"),
  viewsController.getAddSchool
);
router.get(
  "/lending-requests",
  authController.protect,
  authController.restrictTo("school-admin"),
  viewsController.getLendingRequests
);
router.get(
  "/teachers-students",
  authController.protect,
  authController.restrictTo("school-admin"),
  viewsController.getNotVerifiedTeachersStudents
);
router.get(
  "/pending-reservations",
  authController.protect,
  authController.restrictTo("school-admin"),
  viewsController.getPendingReservations
);
router.get(
  "/lendings",
  authController.protect,
  authController.restrictTo("school-admin"),
  viewsController.getLendings
);
router.get(
  "/borrow-in-school",
  authController.protect,
  authController.restrictTo("school-admin"),
  viewsController.getBorrowInSchool
);
router.get(
  "/delayed-lendings",
  authController.protect,
  authController.restrictTo("school-admin"),
  viewsController.getDelayedLendings
);
router.get(
  "/users",
  authController.protect,
  authController.restrictTo("school-admin"),
  viewsController.getUsers
);
router.get(
  "/verify-reviews",
  authController.protect,
  authController.restrictTo("school-admin"),
  viewsController.getStudentReviews
);
router.get(
  "/books",
  authController.protect,
  authController.restrictTo("school-admin"),
  viewsController.getBooks
);

router.get(
  "/queries",
  authController.protect,
  authController.restrictTo("super-admin"),
  viewsController.getQueries
)

router.get(
  "/lendings-per-school",
  authController.protect,
  authController.restrictTo("super-admin"),
  viewsController.getLendingsPerSchool
)

router.get(
  "/writers-teachers-genre",
  authController.protect,
  authController.restrictTo("super-admin"),
  viewsController.getWritersTeachersGenre
)

router.get(
  "/young-teachers-max-books",
  authController.protect,
  authController.restrictTo("super-admin"),
  viewsController.getYoungTeachersMaxBooks
)

router.get(
  "/writers-no-lendings",
  authController.protect,
  authController.restrictTo("super-admin"),
  viewsController.getWritersNoLendings
)

router.get(
  "/school-admins-same-lendings",
  authController.protect,
  authController.restrictTo("super-admin"),
  viewsController.getSchoolAdminsSameLendings
)

router.get(
  "/top3-genre-pairs",
  authController.protect,
  authController.restrictTo("super-admin"),
  viewsController.getTop3GenrePairs
)

router.get(
  "/writers-5-less-than-max",
  authController.protect,
  authController.restrictTo("super-admin"),
  viewsController.getWriters5LessThanMax
)

router.get(
  "/average-rating-genres-users",
  authController.protect,
  authController.restrictTo("school-admin"),
  viewsController.getAverageRatingGenresUsers
)

module.exports = router;
