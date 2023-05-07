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

router.post(
  "/create",
  authController.protect,
  authController.restrictTo("school-admin"),
  bookController.addBook
);

router.get(
  "/lended",
  authController.protect,
  authController.restrictTo("teacher", "student"),
  bookController.selectLendedBooks
);

module.exports = router;
