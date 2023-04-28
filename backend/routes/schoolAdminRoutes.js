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
  
  