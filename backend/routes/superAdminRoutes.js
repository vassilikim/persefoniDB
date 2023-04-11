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

module.exports = router;
