var express = require("express");
var router = express.Router();
var authController = require("../controllers/authController");
var schoolController = require("../controllers/schoolController");

router.get(
  "/",
  authController.protect,
  authController.restrictTo("super-admin"),
  schoolController.selectAllSchools
);

router.post(
  "/create",
  authController.protect,
  authController.restrictTo("super-admin"),
  schoolController.addSchool
);

router.patch(
  "/:schoolID",
  authController.protect,
  authController.restrictTo("super-admin"),
  schoolController.updateSchool
);

router.delete(
  "/:schoolID",
  authController.protect,
  authController.restrictTo("super-admin"),
  schoolController.deleteSchool
);

module.exports = router;
