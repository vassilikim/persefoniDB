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

router.patch(
  "/:bookID",
  authController.protect,
  authController.restrictTo("school-admin"),
  bookController.updateBook
);

router.delete(
  "/:bookID",
  authController.protect,
  authController.restrictTo("school-admin"),
  bookController.deleteBook
);

module.exports = router;
