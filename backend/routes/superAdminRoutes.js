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

router.patch(
  "/verifyschadmin",
  authController.protect,
  authController.restrictTo("super-admin"),
  superAdminController.verifySchoolAdmin
);

router.get(
  "/schools",
  superAdminController.selectAllSchools
);

router.post(
  "/school",
  superAdminController.addSchool
);

router.patch(
  "/school/:schoolID",
  superAdminController.updateSchool
);

router.delete(
  "/school/:schoolID",
  superAdminController.deleteSchool
);

//////////////////////////////  school admin /////////////////////////////////////

// router.get(
//   "/books:schoolName",
//   schoolAdminController.selectAllBooks
// );

router.get(
  "/books/:schoolID",
  superAdminController.selectAllBooks
);

router.post(
  "/book",
  superAdminController.addBook
);

module.exports = router;
