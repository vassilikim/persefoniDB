var express = require("express");
var router = express.Router();
var authController = require("../controllers/authController");
var reservationController = require("../controllers/reservationController");

router.post(
  "/request",
  authController.protect,
  authController.restrictTo("student", "teacher"),
  reservationController.createPendingReservation
);

module.exports = router;
