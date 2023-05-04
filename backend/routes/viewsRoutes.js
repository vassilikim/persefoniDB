var express = require("express");
var router = express.Router();
var viewsController = require("../controllers/viewsController");
var authController = require("../controllers/authController");

router.get("/", viewsController.getLoginPage);
router.get("/main-screen", authController.protect, viewsController.getMainPage);
router.get("/profile",authController.protect,viewsController.getProfile);
router.get("/signup", viewsController.getSignUp);
router.get("/change-password",authController.protect, viewsController.getChangePassword);
router.get("/edit-profile",authController.protect, authController.restrictTo("teacher"), viewsController.getEditProfile);
router.get("/schools",authController.protect, authController.restrictTo("super-admin"), viewsController.getSchools);
router.get("/verify-admin",authController.protect, authController.restrictTo("super-admin"), viewsController.getNotVerifiedSchoolAdmins);

module.exports = router;
