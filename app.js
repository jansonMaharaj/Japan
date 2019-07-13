var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var Location = require("./models/locations");
var seedDB = require("./seeds");
var Comment = require("./models/comments");

seedDB();
mongoose.connect("mongodb://localhost:27017/japan", {useNewUrlParser: true});
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(express.static(__dirname + "/public"));



app.get("/", function (req, res) {
    res.render("landing.ejs");
    // res.send("landing page");
});

//LOCATIONS - shows all locations
app.get("/locations", function (req, res) {
    //GET ALL LOCATIONS FROM DB
    Location.find({}, function (err, allLocations) {
        if (err) {
            console.log(err);

        } else {
            res.render("locations/locations.ejs", {
                locations: allLocations
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
app.get("/locations/:id/comments/new" , function(req,res) {
    //find location by id
    Location.findById(req.params.id, function(err, location) {
        if(err){
            console.log(err);
        } else {
            res.render("comments/new.ejs", {location: location});

        }
    })
});

app.post("/locations/:id/comments", function (req,res) {
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


app.listen(3000);