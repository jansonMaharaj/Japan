var express         = require("express");
var router          = express.Router();
var Location        = require("../models/locations");


//LOCATIONS - shows all locations
router.get("/", function (req, res) {
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


//CREATE A NEW LOCATION AND ADD TO THE DATABASE
router.post("/", function (req, res) {
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


router.get("/new", function (req, res) {
    res.render("locations/new.ejs");
});

//SHOW- shows more info about location
router.get("/:id" , function(req,res) {
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

module.exports = router;