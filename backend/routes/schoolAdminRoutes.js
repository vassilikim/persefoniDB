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
  
  // router.post(
  //   "/book",
  //   schoolAdminController.addBook
  // );
  
//   router.patch(
//     "/book/:schoolName",
//     schoolAdminController.updateBook
//   );
  
//   router.delete(
//     "/school/:schoolName",
//     superAdminController.deleteSchool
//   );

// router.get(
//     "/reservations/:schoolID",
//     schoolAdminController.selectAllReservations
//   );

//   router.get(
//     "/lendings/:schoolID",
//     schoolAdminController.selectAllLendings
//   );
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
  
//////////////////////////////  school admin /////////////////////////////////////

// router.get(
//   "/books:schoolName",
//   schoolAdminController.selectAllBooks
// );

// router.get(
//   "/books/:schoolID",
//   superAdminController.selectAllBooks
// );

// router.post(
//   "/book",
//   superAdminController.addBook
// );
  module.exports = router;
  
  