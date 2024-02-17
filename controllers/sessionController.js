const User = require("../models/User");
const parseVErr = require("../utils/parseValidationErr");

const showRegister = (req, res) => {
  res.render("register");
};

const confirmRegistration = async (req, res, next) => {
  let validation_errors = false;

  if (req.body.password != req.body.password1) {
    req.flash("error", "The passwords entered do not match.");
    validation_errors = true;
  }

  if (!validation_errors) {
    try {
      await User.create(req.body);
    } catch (e) {
      if (e.constructor.name === "ValidationError") {
        parseVErr(e, req);
      } else if (e.name === "MongoServerError" && e.code === 11000) {
        req.flash("error", "That email address is already registered.");
      } else {
        return next(e);
      }
      validation_errors = true;
    }
  }

  if (!validation_errors) {
    res.redirect("/sessions/logon");
  } else {
    return res.render("register", { errors: req.flash("error") });
  }
};


const logoff = (req, res) => {
  req.session.destroy(function (err) {
    if (err) {
      console.log(err);
    }
    res.redirect("/");
  });
};

const showLogon = async (req, res) => {
  try {
    if (req.user) {
      return res.redirect("/");
    }
    const errorMessage = req.query.error;

    res.render("logon", { errorMessage });
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
};

module.exports = {
  showRegister,
  confirmRegistration,
  logoff,
  showLogon,
};
