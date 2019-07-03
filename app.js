var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var Campground = require("./models/campgrounds");
var seedDB = require("./seeds");
var Comment = require("./models/comments");

seedDB();
mongoose.connect("mongodb://localhost:27017/yelp_camp", {useNewUrlParser: true});
app.use(bodyParser.urlencoded({
    extended: true
}));



app.get("/", function (req, res) {
    res.render("landing.ejs");
    // res.send("landing page");
});

//CAMPGROUNDS - shows all campgrounds
app.get("/campgrounds", function (req, res) {
    //GET ALL CAMPGROUNDS FROM DB
    Campground.find({}, function (err, allCampgrounds) {
        if (err) {
            console.log(err);

        } else {
            res.render("campgrounds/campgrounds.ejs", {
                campgrounds: allCampgrounds
            });

        }
    })

});


app.post("/campgrounds", function (req, res) {
    var name = req.body.name;
    var image = req.body.image;
    var imageCity = req.body.imageCity;
    var descriptionCity = req.body.descriptionCity;
    var description = req.body.description;
    var newCampground = {
        name: name,
        image: image,
        imageCity: imageCity,
        description:description,
        descriptionCity:descriptionCity
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
    res.render("campgrounds/new.ejs");
});

//SHOW- shows more info about campground
app.get("/campgrounds/:id" , function(req,res) {
    //find the campground with provide Id
    Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground) {
        if(err) {
            console.log(err);

        } else {
            console.log(foundCampground);
            //render show template with that campground
            res.render("campgrounds/show.ejs" , {campground: foundCampground});

        }

    });
});

// ===========================
// Comments route
// ===========================
app.get("/campgrounds/:id/comments/new" , function(req,res) {
    //find campground by id
    Campground.findById(req.params.id, function(err, campground) {
        if(err){
            console.log(err);
        } else {
            res.render("comments/new.ejs", {campground: campground});

        }
    })
});

app.post("/campgrounds/:id/comments", function (req,res) {
    // lookup campground using ID
    Campground.findById(req.params.id, function(err, campground) {
        if(err) {
            console.log(err);
            res.redirect("/campgrounds");
        }else {
           
            //create new comment
            Comment.create(req.body.comment, function (err, comment) {
                if(err) {
                    console.log(err);
                } else {
                    //connect new comment to campground
                    campground.comments.push(comment);
                    campground.save();
                    //redirect campground show page
                    res.redirect("/campgrounds/" + campground._id);
                }
            })

        }
    })

})


app.listen(3000);