var express         = require("express");
var router          = express.Router({mergeParams: true});
var Location        = require("../models/locations");
var Comment         = require("../models/comments");


// COMMENTS NEW
router.get("/new" , isLoggedIn, function(req,res) {
    //find location by id
    Location.findById(req.params.id, function(err, location) {
        if(err){
            console.log(err);
        } else {
            res.render("comments/new.ejs", {location: location});

        }
    })
});

router.post("/", isLoggedIn, function (req,res) {
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
                    //add username and id to comment
                    comment.author.id = req.user._id;
                    comment.author.username = req.user.username;
                    //save comment
                    comment.save();
                    //connect new comment to location
                    location.comments.push(comment);
                    location.save();
                    //redirect location show page
                    console.log(comment);
                    res.redirect("/locations/" + location._id);
                }
            })

        }
    })

})

//MIDDLEWARE
function isLoggedIn(req, res, next) {
    if(req.isAuthenticated()) {
        return next();

    }
    res.redirect("/login");
}

module.exports = router;