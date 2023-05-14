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
  "/schools",
  authController.protect,
  authController.restrictTo("super-admin"),
  superAdminController.selectAllSchools
);

router.post(
  "/school",
  authController.protect,
  authController.restrictTo("super-admin"),
  superAdminController.addSchool
);

router.patch(
  "/school/:schoolID",
  authController.protect,
  authController.restrictTo("super-admin"),
  superAdminController.updateSchool
);

router.delete(
  "/school/:schoolID",
  // authController.protect,
  // authController.restrictTo("super-admin"),
  superAdminController.deleteSchool
);

module.exports = router;
