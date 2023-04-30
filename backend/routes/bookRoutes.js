var express = require("express");
var router = express.Router();
var authController = require("../controllers/authController");
var bookController = require("../controllers/bookController");

router.get(
  "/",
  authController.protect,
  authController.restrictTo("school-admin", "teacher", "student"),
  bookController.selectAllBooks
);

module.exports = router;