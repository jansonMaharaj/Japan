var express         = require("express");
var router          = express.Router();
var Event           = require("../models/events");
var Comment         = require("../models/comments");


//EVENTS - shows all events
router.get("/", function (req, res) {
    //GET ALL Events FROM DB
    Event.find({}, function (err, allEvents) {
        if (err) {
            console.log(err);

        } else {
            res.render("events/events.ejs", {
                events: allEvents,
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
    var newEvent = {
        name: name,
        image: image,
        imageCity: imageCity,
        description:description,
        descriptionCity:descriptionCity
    }
    //CREATE A NEW LOCATION AND SAVE TO DB
    Event.create(newEvent, function (err, newlyCreated) {
        if (err) {
            console.log(err);
        } else {
            //redirect to locations page
            res.redirect("/events");
        }
    });
});


router.get("/new", function (req, res) {
    res.render("events/new.ejs");
});

//SHOW- shows more info about event
router.get("/:id" , function(req,res) {
    //find the event with provide Id
    Event.findById(req.params.id).populate("comments").exec(function(err, foundEvent) {
        if(err) {
            console.log(err);

        } else {
            console.log(foundEvent);
            //render show template with that event
            res.render("events/show.ejs" , {event: foundEvent});

        }

    });
});

module.exports = router;