var express         = require("express");
var router          = express.Router();
var passport        = require("passport");
var User            = require("../models/user");

//LANDING PAGE

router.get("/", function (req, res) {
    res.render("landing.ejs");
    
});

//=========================================
//  AUTH ROTUES
//=========================================

//show register form
router.get("/register" , function(req,res) {
    res.render("register.ejs");
});

// handle sign up logic
router.post("/register", function(req,res) {
    var newUser = new User({username: req.body.username});
    User.register(newUser, req.body.password, function(err,user) {
        if(err) {
            req.flash("error", err.message);
            return res.redirect("register");
        } else {
            passport.authenticate("local")(req, res, function() {
                req.flash("success", "Welcome " + user.username);
                res.redirect("/locations");
            });
        }
    });
});

// show login form
router.get("/login", function(req,res) {
    res.render("login.ejs");
});

// handling login logic
router.post("/login",passport.authenticate("local", 
    {
        successRedirect: "/locations",
        failureRedirect: "/login"
    }), function(req,res) {

});

// logout route
router.get("/logout", function(req,res) {
    req.logout();
    req.flash("success", "logged you out");
    res.redirect("/");
});

module.exports = router;