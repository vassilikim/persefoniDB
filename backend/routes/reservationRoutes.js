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

router.get(
  "/allrequests",
  authController.protect,
  authController.restrictTo("school-admin"),
  reservationController.getAllPendingReservations
);

module.exports = router;
