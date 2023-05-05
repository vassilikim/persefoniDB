var express = require("express");
var router = express.Router();
var authController = require("../controllers/authController");
var schoolAdminController = require("../controllers/schoolAdminController");

  router.get(
    "/books",
    authController.protect,
    authController.restrictTo("school-admin"),
    schoolAdminController.selectAllBooks
  );
  
  router.post(
    "/book",
    authController.protect,
    authController.restrictTo("school-admin"),
    schoolAdminController.addBook
  );
  
  router.patch(
    "/book/:bookID",
    authController.protect,
    authController.restrictTo("school-admin"),
    schoolAdminController.updateBook
  );
router.get(
  "/reservations",
  authController.protect,
  authController.restrictTo("school-admin"),
  schoolAdminController.selectAllReservations
);

router.get(
  "/lendings",
  authController.protect,
  authController.restrictTo("school-admin"),
  schoolAdminController.selectAllLendings
);

router.get(
    "/reservations/:userID",
    authController.protect,
    authController.restrictTo("school-admin"),
    schoolAdminController.selectResforUser
  );

  router.get(
    "/lendings/:userID",
    authController.protect,
    authController.restrictTo("school-admin"),
    schoolAdminController.selectLenforUser
  );

  router.get(
    "/delayed_lendings",
    authController.protect,
    authController.restrictTo("school-admin"),
    schoolAdminController.selectDelayedLen
  );

  router.delete(
    "/book/:bookID",
    authController.protect,
    authController.restrictTo("school-admin"),
    schoolAdminController.deleteBook
  );
  
  module.exports = router;
  
  