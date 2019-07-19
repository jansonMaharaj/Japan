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
    });
});

//COMMENTS CREATE
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
            });

        }
    });

});

//COMMENT EDIT ROUTE
router.get("/:comment_id/edit" , checkCommentOwnership, function(req , res) {
    Comment.findById(req.params.comment_id, function (err, foundComment) {
        if(err) {
            res.redirect("back");
        } else {
            res.render("comments/edit.ejs", {location_id: req.params.id, comment: foundComment});

        }
    });
});

//COMMENT UPDATE
router.put("/:comment_id", checkCommentOwnership , function(req,res) {
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updatedComment) {
        if(err) {
            
            res.redirect("back");
        } else {
            res.redirect("/locations/" + req.params.id);
        }
    });
});

//COMMENT DELETE
router.delete("/:comment_id", checkCommentOwnership ,function(req, res) {
    //find by id and remove
    Comment.findByIdAndRemove(req.params.comment_id, function(err) {
        if(err) {
            res.redirect("back");
        } else {
            res.redirect("/locations/" + req.params.id);
        }
    });
});

//MIDDLEWARE
function isLoggedIn(req, res, next) {
    if(req.isAuthenticated()) {
        return next();

    }
    res.redirect("/login");
}


function checkCommentOwnership(req,res,next) {
    if (req.isAuthenticated()) {
        Comment.findById(req.params.comment_id, function (err, foundComment) {
            if(err) {
                res.redirect("back");
            } else {
                // does user own comments
                if(foundComment.author.id.equals(req.user._id)) {
                    next();
                } else {
                    res.redirect("back");
                }
            }
        });
    } else {
        res.redirect("back");
    }
}

module.exports = router;