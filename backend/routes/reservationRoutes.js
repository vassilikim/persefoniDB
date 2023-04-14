var express = require("express");
var router = express.Router();
var authController = require("../controllers/authController");
var reservationController = require("../controllers/reservationController");

router.post(
  "/makereservation",
  authController.protect,
  authController.restrictTo("student", "teacher"),
  reservationController.createReservation
);

router.post(
  "/handlereservation",
  authController.protect,
  authController.restrictTo("school-admin"),
  reservationController.handleReservation
);

router.get(
  "/allreservations",
  authController.protect,
  authController.restrictTo("school-admin"),
  reservationController.getAllReservations
);

module.exports = router;
