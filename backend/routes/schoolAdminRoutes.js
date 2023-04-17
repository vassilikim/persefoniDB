var express = require("express");
var router = express.Router();
var authController = require("../controllers/authController");
var schoolAdminController = require("../controllers/schoolAdminController");

router.get(
  "/teachers-students",
  authController.protect,
  authController.restrictTo("school-admin"),
  schoolAdminController.getNotVerifiedTeachersStudents
);

router.patch(
  "/verifyteacherstudent",
  authController.protect,
  authController.restrictTo("school-admin"),
  schoolAdminController.verifyTeacherStudent
);

module.exports = router;
