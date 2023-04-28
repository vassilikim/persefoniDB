var express = require("express");
var router = express.Router();
var backupController = require("../controllers/backupController");
var authController = require("../controllers/authController");
var superAdminController = require("../controllers/superAdminController");

router.get(
  "/backup",
  authController.protect,
  authController.restrictTo("super-admin"),
  backupController.backup
);

router.get(
  "/restore",
  authController.protect,
  authController.restrictTo("super-admin"),
  backupController.restore
);

router.get(
  "/school-admins",
  authController.protect,
  authController.restrictTo("super-admin"),
  superAdminController.getNotVerifiedSchoolAdmins
);

router.patch(
  "/verifyschadmin",
  authController.protect,
  authController.restrictTo("super-admin"),
  superAdminController.verifySchoolAdmin
);

router.get(
  "/lendings-per-school",
  authController.protect,
  authController.restrictTo("super-admin"),
  superAdminController.getNumOfLendingsPerSchool
);

router.get(
  "/writers-teachers-genre",
  authController.protect,
  authController.restrictTo("super-admin"),
  superAdminController.getWritersTeachersPerGenre
);

router.get(
  "/young-teachers-max-books",
  authController.protect,
  authController.restrictTo("super-admin"),
  superAdminController.getYoungTeachersWithMaxBooks
);

router.get(
  "/writers-no-lendings",
  authController.protect,
  authController.restrictTo("super-admin"),
  superAdminController.getWritersWithNoLendings
);

router.get(
  "/school-admins-same-lendings",
  authController.protect,
  authController.restrictTo("super-admin"),
  superAdminController.getSchoolAdminsWithSameLendings
);

router.get(
  "/top3-genre-pairs",
  authController.protect,
  authController.restrictTo("super-admin"),
  superAdminController.getTop3GenrePairs
);

router.get(
  "/writers-5-less-than-max",
  authController.protect,
  authController.restrictTo("super-admin"),
  superAdminController.getWritersWith5BooksLessThanMax
);

module.exports = router;
