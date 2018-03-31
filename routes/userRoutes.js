var express = require("express");
var router = express.Router();
var passport = require("passport");
var LocalStrategy = require("passport-local").Strategy;
const User = require("../models/user");

// Register User
router.post("/register", function(req, res) {
  var email = req.body.email;
  var password = req.body.pwd;
  var password2 = req.body.pwd2;

  // Validation
  req.checkBody("email", "Email is required").notEmpty();
  req.checkBody("email", "Email is not valid").isEmail();
  req.checkBody("pwd", "Password is required").notEmpty();
  req.checkBody("pwd2", "Passwords do not match").equals(password);

  let errors = req.validationErrors();

  if (errors) {
    res.render("register", {
      errors: errors
    });
  } else {
    const newUser = new User({
      _id: email,
      password: password
    });

    User.createUser(newUser, function(err, user) {
      if (err) {
        if (err.name && err.name === "BulkWriteError") {
          req.flash("error_msg", "Already registed! Please log in.");
          res.redirect("/user/login");
        } else {
          throw err;
        }
      } else {
        console.log(user);
        req.flash("success_msg", "You are registered and can now login");

        res.redirect("/user/login");
      }
    });
  }
});

passport.use(
  new LocalStrategy(
    {
      usernameField: "email",
      passwordField: "pwd"
    },
    function(username, password, done) {
      User.getUserByUsername(username, function(err, user) {
        if (err) throw err;
        if (!user) {
          return done(null, false, { message: "Unknown User" });
        }

        User.comparePassword(password, user.password, function(err, isMatch) {
          if (err) throw err;
          if (isMatch) {
            return done(null, user);
          } else {
            return done(null, false, { message: "Invalid password" });
          }
        });
      });
    }
  )
);

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  User.findById(id, function(err, user) {
    done(err, user);
  });
});

router.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/user/login",
    failureFlash: true
  }),
  function(req, res) {
    // If this function gets called, authentication was successful.
    // `req.user` contains the authenticated user.
    res.redirect("/");
  }
);

router.get("/register", function(req, res) {
  res.render("register", {
    errors: null
  });
});

// Login
router.get("/login", function(req, res) {
  res.render("login");
});

router.get("/logout", function(req, res) {
  req.logout();

  req.flash("success_msg", "You are logged out");

  res.redirect("/user/login");
});

module.exports = router;
