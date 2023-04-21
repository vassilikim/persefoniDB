var express = require("express");
var router = express.Router();
var viewsController = require("../controllers/viewsController");
var authController = require("../controllers/authController");

router.get("/", viewsController.getLoginPage);
router.get("/main-screen", authController.protect, viewsController.getMainPage);

module.exports = router;
