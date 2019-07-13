var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var passport = require("passport");
var LocalStrategy = require("passport-local");
var Location = require("./models/locations");
var Comment = require("./models/comments");
var User = require("./models/user");
var seedDB = require("./seeds");

seedDB();
mongoose.connect("mongodb://localhost:27017/japan", {useNewUrlParser: true});
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname + "/public"));

//PASSPORT CONFIGURATION
app.use(require("express-session")({
    secret : " once again Rusty wins cutest dog",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser( User.serializeUser());
passport.deserializeUser( User.deserializeUser());

app.use(function(req, res, next) {
    res.locals.currentUser = req.user;
    next();
});


//LANDING PAGE

app.get("/", function (req, res) {
    res.render("landing.ejs");
    
});

//LOCATIONS - shows all locations
app.get("/locations", function (req, res) {
    //GET ALL LOCATIONS FROM DB
    Location.find({}, function (err, allLocations) {
        if (err) {
            console.log(err);

        } else {
            res.render("locations/locations.ejs", {
                locations: allLocations,
                currentUser: req.user
            });

        }
    })

});


app.post("/locations", function (req, res) {
    var name = req.body.name;
    var image = req.body.image;
    var imageCity = req.body.imageCity;
    var descriptionCity = req.body.descriptionCity;
    var description = req.body.description;
    var newLocation = {
        name: name,
        image: image,
        imageCity: imageCity,
        description:description,
        descriptionCity:descriptionCity
    }
    //CREATE A NEW LOCATION AND SAVE TO DB
    Location.create(newLocation, function (err, newlyCreated) {
        if (err) {
            console.log(err);
        } else {
            //redirect to locations page
            res.redirect("/locations");
        }
    });
});


app.get("/locations/new", function (req, res) {
    res.render("locations/new.ejs");
});

//SHOW- shows more info about location
app.get("/locations/:id" , function(req,res) {
    //find the location with provide Id
    Location.findById(req.params.id).populate("comments").exec(function(err, foundLocation) {
        if(err) {
            console.log(err);

        } else {
            console.log(foundLocation);
            //render show template with that location
            res.render("locations/show.ejs" , {location: foundLocation});

        }

    });
});

// ===========================
// Comments route
// ===========================
app.get("/locations/:id/comments/new" , isLoggedIn, function(req,res) {
    //find location by id
    Location.findById(req.params.id, function(err, location) {
        if(err){
            console.log(err);
        } else {
            res.render("comments/new.ejs", {location: location});

        }
    })
});

app.post("/locations/:id/comments", isLoggedIn, function (req,res) {
    // lookup location using ID
    Location.findById(req.params.id, function(err, location) {
        if(err) {
            console.log(err);
            res.redirect("/locations");
        }else {
           
            //create new comment
            Comment.create(req.body.comment, function (err, comment) {
                if(err) {
                    console.log(err);
                } else {
                    //connect new comment to location
                    location.comments.push(comment);
                    location.save();
                    //redirect location show page
                    res.redirect("/locations/" + location._id);
                }
            })

        }
    })

})


//=========================================
//  AUTH ROTUES
//=========================================

//show register form
app.get("/register" , function(req,res) {
    res.render("register.ejs");
});

// handle sign up logic
app.post("/register", function(req,res) {
    var newUser = new User({username: req.body.username});
    User.register(newUser, req.body.password, function(err,user) {
        if(err) {
            console.log(err);
            return res.render("register");
        }
        passport.authenticate("local")(req, res, function() {
            res.redirect("/locations");
        })
    })
});

// show login form
app.get("/login", function(req,res) {
    res.render("login.ejs");
})

// handling login logic
app.post("/login",passport.authenticate("local", 
    {
        successRedirect: "/locations",
        failureRedirect: "/login"
    }), function(req,res) {

});

// logout route
app.get("/logout", function(req,res) {
    req.logout();
    res.redirect("/");
});

function isLoggedIn(req, res, next) {
    if(req.isAuthenticated()) {
        return next();

    }
    res.redirect("/login");
}

app.listen(3000);