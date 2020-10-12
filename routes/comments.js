var express = require('express');
var router = express.Router({ mergeParams: true });
var Campground = require('../models/campground');
var Comment = require('../models//comment');
var middleware = require('../middleware')

//comments new 
router.get('/new', middleware.isLoggedIn, (req, res) => {
    //find by id and send it through ejs
    Campground.findById(req.params.id, (err, campground) => {
        if (err) {
            console.log(err);
        } else {
            res.render('comments/new', { campground: campground });
        }
    })
});

//comments create
router.post('/', middleware.isLoggedIn, (req, res) => {
    Campground.findById(req.params.id, (err, campground) => {
        if (err) {
            console.log(err);
            res.redirect("/campgrounds")
        } else {
            Comment.create(req.body.comment, (err, comment) => {
                if (err) {
                    req.flash("error", "Something went wrong")
                    console.log(err)
                } else {
                    //add username and id to comment
                    comment.author.id = req.user._id;
                    comment.author.username = req.user.username;
                    //save comment
                    comment.save();
                    campground.comments.push(comment);
                    campground.save();
                    req.flash("success", "Successfully added comment")
                    res.redirect(`/campgrounds/${campground._id}`);
                }
            })
        }
    })
});

//COMMENTS EDIT ROUTE
router.get('/:comment_id/edit', middleware.checkCommentOwnership, (req, res) => {
    Comment.findById(req.params.comment_id, (err, comment) => {
        if (err) {
            console.log(err);
            res.redirect('back');
        } else {
            res.render("comments/edit", { campground_id: req.params.id, comment: comment });
        }
    })
});

//COMMENT UPDATE ROUTE
router.put('/:comment_id', middleware.checkCommentOwnership, (req, res) => {
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, (err, data) => {
        if (err) {
            req.flash("error", "Something went wrong");
            res.redirect('back')
        } else {
            req.flash("success", "Comment updated");
            res.redirect('/campgrounds/' + req.params.id);
        }
    })
});

//comment destroy route
router.delete('/:comment_id', middleware.checkCommentOwnership, (req, res) => {
    //findbyidremove
    Comment.findByIdAndDelete(req.params.comment_id, (err) => {
        if (err) {
            res.redirect('back');
        } else {
            Campground.findById(req.params.id, (err, foundcampground) => {
                let comments_array = foundcampground.comments;
                const index = comments_array.indexOf(req.params.comment_id);
                if (index > -1) {
                    comments_array.splice(index, 1);
                }
                foundcampground.save();
            })
            req.flash("success", "Comment deleted");
            res.redirect('/campgrounds/' + req.params.id);
        }
    });
});

//authorisation for comment


module.exports = router;