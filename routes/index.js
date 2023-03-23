var express = require("express");
var router = express.Router();
var testController = require("../controllers/testController");

router.get("/", testController.getTables);

module.exports = router;
