var Comment         = require("../models/comments");
var middlewareObj   = {};

middlewareObj.checkCommentOwnership = function (req,res,next) {
    if (req.isAuthenticated()) {
        Comment.findById(req.params.comment_id, function (err, foundComment) {
            if(err) {
                res.redirect("back");
            } else {
                // does user own comments
                if(foundComment.author.id.equals(req.user._id)) {
                    next();
                } else {
                    req.flash("error", "you dont have permission to do that!")
                    res.redirect("back");
                }
            }
        });
    } else {
        req.flash("error", "Please Login First!!")
        res.redirect("back");
    }
}

middlewareObj.isLoggedIn = function (req, res, next) {
    if(req.isAuthenticated()) {
        return next();

    }
    req.flash("error", "Please Login First!!");
    res.redirect("/login");
}


module.exports = middlewareObj