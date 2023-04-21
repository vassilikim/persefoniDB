exports.getMainPage = async (req, res, next) => {
  if (req.role == "super-admin") {
    res.status(200).render("super-admin");
  } else {
    console.log("error");
  }
};

exports.getLoginPage = async (req, res, next) => {
  res.status(200).render("login");
};
