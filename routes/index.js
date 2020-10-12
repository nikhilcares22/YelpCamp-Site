var express = require('express');
var router = express.Router();
var User = require('../models/user');
var passport = require('passport');

//root route
router.get('/', (req, res) => {
    res.render("landing");
});

//show register form 
router.get("/register", (req, res) => {
    res.render("register");
});

//handel sign up logic
router.post("/register", (req, res) => {
    var newUser = new User({ username: req.body.username })
    User.register(newUser, req.body.password, (err, user) => {
        if (err) {
            req.flash("error", err.message)
            console.log(err);
            return res.render("register");
        }
        passport.authenticate('local')(req, res, () => {
            req.flash("success", "Welcome to Yelpcamp " + user.username)
            res.redirect("/campgrounds");
        });
    });
});

//show login form
router.get('/login', (req, res) => {
    res.render("login");
});

//handels login logic
router.post('/login', passport.authenticate("local", {
    successRedirect: "/campgrounds",
    failureRedirect: "/login",
    failureFlash: true,
    successFlash: `Welcome back! `
}), (req, res) => { console.log(req.body.username) });

//LOGOUT ROUTE
router.get('/logout', (req, res) => {
    req.flash("success", "Logged You Out");
    req.logout();
    res.redirect("/campgrounds");
});

module.exports = router;