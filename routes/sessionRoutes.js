const express = require("express");
const passport = require("passport");
const router = express.Router();

const {
  showRegister,
  confirmRegistration,
  logoff,
  showLogon,
} = require("../controllers/sessionController");

router.route("/register").get(showRegister).post(confirmRegistration);

router
  .route("/logon")
  .get(showLogon)
  .post(
    passport.authenticate("local", {
      successRedirect: "/",
      failureRedirect: "/sessions/logon",
      failureFlash: true,
    })
  );

router.route("/logoff").post(logoff);

module.exports = router;
