var express         = require("express");
var router          = express.Router({mergeParams: true});
var Location        = require("../models/locations");
var Comment         = require("../models/comments");
var middleware      = require("../middleware");


// COMMENTS NEW
router.get("/new" , middleware.isLoggedIn, function(req,res) {
    //find location by id
    Location.findById(req.params.id, function(err, location) {
        if(err){
            console.log(err);
        } else {
            res.render("comments/new.ejs", {location: location});

        }
    });
});

//COMMENTS CREATE
router.post("/", middleware.isLoggedIn, function (req,res) {
    // lookup location using ID
    Location.findById(req.params.id, function(err, location) {
        if(err) {
            console.log(err);
            res.redirect("/locations");
        }else {   
            //create new comment
            Comment.create(req.body.comment, function (err, comment) {
                if(err) {
                    req.flash("error", "something went wrong");
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
                    req.flash("success", "Successfully added comment");
                    res.redirect("/locations/" + location._id);
                }
            });

        }
    });

});

//COMMENT EDIT ROUTE
router.get("/:comment_id/edit" , middleware.checkCommentOwnership, function(req , res) {
    Comment.findById(req.params.comment_id, function (err, foundComment) {
        if(err) {
            res.redirect("back");
        } else {
            res.render("comments/edit.ejs", {location_id: req.params.id, comment: foundComment});

        }
    });
});

//COMMENT UPDATE
router.put("/:comment_id", middleware.checkCommentOwnership , function(req,res) {
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updatedComment) {
        if(err) {
            
            res.redirect("back");
        } else {
            req.flash("succes", "Comment Updated");
            res.redirect("/locations/" + req.params.id);
        }
    });
});

//COMMENT DELETE
router.delete("/:comment_id", middleware.checkCommentOwnership ,function(req, res) {
    //find by id and remove
    Comment.findByIdAndRemove(req.params.comment_id, function(err) {
        if(err) {
            res.redirect("back");
        } else {
            req.flash("success", "Comment Deleted");
            res.redirect("/locations/" + req.params.id);
        }
    });
});


module.exports = router;