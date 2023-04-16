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

module.exports = router;
