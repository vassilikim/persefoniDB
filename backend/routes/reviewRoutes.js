var express = require("express");
var router = express.Router();
var authController = require("../controllers/authController");
var reviewController = require("../controllers/reviewController");

router.post(
  "/makereview",
  authController.protect,
  authController.restrictTo("student", "teacher"),
  reviewController.createReview
);

router.get(
  "/notverified",
  authController.protect,
  authController.restrictTo("school-admin"),
  reviewController.getNotVerifedReviews
);

router.patch(
  "/verify",
  authController.protect,
  authController.restrictTo("school-admin"),
  reviewController.verifyStudentReview
);

module.exports = router;
