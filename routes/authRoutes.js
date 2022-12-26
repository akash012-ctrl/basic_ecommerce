const express = require("express");
const router = express.Router();
const User = require("../models/User");
const passport = require("passport");

router.get("/register", (req, res) => {
  res.render("auth/signup");
});

router.get("/login", (req, res) => {
  res.render("auth/login");
});

router.post("/register", async (req, res) => {
  try {
    const { username, password, email,userType } = req.body;
    const user = new User({ username, email, userType });
    await User.register(user, password);
    req.flash("success", "Registered Successfully");
    res.redirect("/login");
  } catch (error) {
    req.flash('error', e.message);
    res.redirect('/register');
  }
});

router.post(
  "/login",
  passport.authenticate("local", {
    failureRedirect: "/login",
    failureMessage: true,
    failureFlash: true,
  }),
  function (req, res) {
    req.flash("success", `Welcome back Again ${req.user.username}`);
    res.redirect("/products");
  }
);

router.get("/logout", (req, res) => {
  req.logout((err) => {
    if(err){
       return req.flash('error',`Error in logout : ${err}`);
    }
    req.flash("success", "See you again");
    res.redirect("/login");
  });
});

module.exports = router;
