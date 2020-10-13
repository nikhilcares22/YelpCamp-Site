var express = require('express');
var Campground = require('../models/campground');
var router = express.Router();
var middleware = require('../middleware');


// //SHOW ALL CAMPGROUNDS
router.get('/', (req, res) => {
    Campground.find({}, (err, campgrounds) => {
        if (err) {
            console.log(err);
        } else {
            res.render("campgrounds/index", { campgrounds: campgrounds });
        }
    })

});



//ADD NEW CAMPGROUNDS TO DATABASE
router.post('/', middleware.isLoggedIn, (req, res) => {
    //get data from form and add to the campgrounds get request and redirect to the campgrounds
    var name = req.body.name;
    var image = req.body.image;
    var price = req.body.price;
    var description = req.body.description;
    var author = {
        id: req.user._id,
        username: req.user.username
    }
    var newCampground = { name: name, price: price, image: image, description: description, author: author }
    Campground.create(newCampground, (err, result) => {
        if (err) {
            console.log(err);
        } else {
            req.flash("success", "Campground added successfully")
                // console.log(`added a new Campground via form`);
                // console.log(result);
            res.redirect('/campgrounds');
        }
    })

});

//DISPLAY A FORM TO CREATE A NEW CAMPGROUND
router.get('/new', middleware.isLoggedIn, (req, res) => {
    res.render('campgrounds/new.ejs')
});

//SHOW - show more info about one campground
router.get('/:id', (req, res) => {
    //find the campground with the specified id in the params
    //render show template with that compound
    Campground.findById(req.params.id)
        .populate('comments')
        .exec((err, foundCampground) => {
            if (err) {
                console.log(err);
            } else {
                res.render("campgrounds/show", { campground: foundCampground });
            }
        })

});

//EDIT CAMPGROUND ROUTE
router.get('/:id/edit', middleware.checkCampgroundOwnership, (req, res) => {
    Campground.findById(req.params.id, (err, foundCampground) => {
        if (err) {
            console.log(err);
        }
        res.render('campgrounds/edit', { campground: foundCampground });
    });
});

//UPDATE CAMPGROUND ROUTE
router.put('/:id', middleware.checkCampgroundOwnership, (req, res) => {
    //find the campground
    //redirect somewhere (show page)
    Campground.findByIdAndUpdate(req.params.id, req.body.campground, (err, updatedCampground) => {
        if (err) {
            console.log(err);
            res.redirect('/campgrounds');
        } else {
            req.flash("success", "Campground updated");
            res.redirect(`/campgrounds/${req.params.id}`);
        }
    })
});

//DESTROY CAMPGROUND ROUTE
router.delete('/:id', middleware.checkCampgroundOwnership, (req, res) => {
    Campground.findByIdAndRemove(req.params.id, (err) => {
        if (err) {
            console.log(err);
            res.redirect('/campgrounds');
        } else {
            req.flash("success", "Campground deleted");
            res.redirect('/campgrounds');
        }
    });
});


module.exports = router;