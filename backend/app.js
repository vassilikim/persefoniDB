var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");

var superAdminRouter = require("./routes/superAdminRoutes");
var authRouter = require("./routes/authRoutes");

var app = express();

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/library/super-admin", superAdminRouter);
app.use("/library/auth", authRouter);

module.exports = app;
