var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var mongoose = require("mongoose");

mongoose.connect("mongodb://localhost:27017/yelp_camp", {useNewUrlParser: true});
app.use(bodyParser.urlencoded({
    extended: true
}));

// SCHEMA SETUP
var campgroundSchema = new mongoose.Schema({
    name: String,
    image: String,
    description: String
});

var Campground = mongoose.model("Campground", campgroundSchema);

// save campground to db
// Campground.create({
//         name: "auckland camp",
//         image: " https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQVHHZ98u6Sj1KavFhu7XPQeH8l1G2SqHn0wl7rvGIdielR7ZmC",
//         description: "beautiful campground by the sea"
//     },
//     function (err, campground) {
//         if (err) {
//             console.log("some error was made when creating a new campground");
//             console.log(err);
//         } else {
//             console.log("campground has benn saved to db");
//             console.log(campground);
//         }
//     })


app.get("/", function (req, res) {
    res.render("landing.ejs");
    // res.send("landing page");
});

app.get("/campgrounds", function (req, res) {
    //GET ALL CAMPGROUNDS FROM DB
    Campground.find({}, function (err, allCampgrounds) {
        if (err) {
            console.log("some error was made when looking for campgrounds in db");
            console.log(err);

        } else {
            res.render("campgrounds.ejs", {
                campgrounds: allCampgrounds
            });

        }
    })

});


app.post("/campgrounds", function (req, res) {
    var name = req.body.name;
    var image = req.body.image;
    var description = req.body.description;
    var newCampground = {
        name: name,
        image: image,
        description:description
    }
    //CREATE A NEW CAMPGROUND AND SAVE TO DB
    Campground.create(newCampground, function (err, newlyCreated) {
        if (err) {
            console.log(err);
        } else {
            //redirect to campgrounds page
            res.redirect("/campgrounds");
        }
    });
});


app.get("/campgrounds/new", function (req, res) {
    res.render("new.ejs");
});

//SHOW- shows more info about campground
app.get("/campgrounds/:id" , function(req,res) {
    //find the campground with provide Id
    Campground.findById(req.params.id, function(err, foundCampground) {
        if(err) {
            console.log(err);

        } else {
            //render show template with that campground
            res.render("show.ejs", {campground: foundCampground});

        }

    })
});




app.listen(3000);