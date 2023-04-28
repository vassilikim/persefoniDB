var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");

var superAdminRouter = require("./routes/superAdminRoutes");
var schoolAdminRouter = require("./routes/schoolAdminRoutes");
var authRouter = require("./routes/authRoutes");

var app = express();

app.set("view engine", "pug");
app.set("views", path.join(__dirname, "views"));

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
  res.status(200).render("login");
});

app.use("/api/library/super-admin", superAdminRouter);
app.use("/api/library/school-admin", schoolAdminRouter);
app.use("/api/library/auth", authRouter);

module.exports = app;
