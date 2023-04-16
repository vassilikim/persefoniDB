var express = require("express");
var router = express.Router();
var authController = require("../controllers/authController");
var userController = require("../controllers/userController");

router.get(
  "/teachers-students",
  authController.protect,
  authController.restrictTo("school-admin"),
  userController.getAllTeachersStudents
);

router.patch(
  "/deactivate",
  authController.protect,
  authController.restrictTo("school-admin"),
  userController.deactivateTeacherStudent
);

router.delete(
  "/delete",
  authController.protect,
  authController.restrictTo("school-admin"),
  userController.deleteTeacherStudent
);

module.exports = router;
