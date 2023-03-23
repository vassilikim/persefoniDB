var express = require("express");
var router = express.Router();
var testController = require("../controllers/testController");

/* GET users listing. */
router.get("/backup", testController.backup);
router.get("/restore", testController.restore);

module.exports = router;
