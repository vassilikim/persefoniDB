var express = require("express");
var router = express.Router();
var backupController = require("../controllers/backupController");

/* GET users listing. */
router.get("/backup", backupController.backup);
router.get("/restore", backupController.restore);

module.exports = router;
