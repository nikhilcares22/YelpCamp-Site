var express = require('express');
var router = express.Router();
Campground = require('../models/campground'),


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
router.post('/', isLoggedIn, (req, res) => {
    //get data from form and add to the campgrounds get request and redirect to the campgrounds
    var name = req.body.name;
    var image = req.body.image;
    var description = req.body.description;
    var author = {
        id: req.user._id,
        username: req.user.username
    }
    var newCampground = { name: name, image: image, description: description, author: author }
    Campground.create(newCampground, (err, result) => {
        if (err) {
            console.log(err);
        } else {
            // console.log(`added a new Campground via form`);
            // console.log(result);
            res.redirect('/campgrounds');
        }
    })

});

//DISPLAY A FORM TO CREATE A NEW CAMPGROUND
router.get('/new', isLoggedIn, (req, res) => {
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
router.get('/:id/edit', (req, res) => {
    Campground.findById(req.params.id, (err, foundCampground) => {
        if (err) {
            console.log(err);
            res.redirect('/campgrounds');
        } else {
            res.render('campgrounds/edit', { campground: foundCampground });
        }
    });
});

//UPDATE CAMPGROUND ROUTE
router.put('/:id', (req, res) => {
    //find the campground
    //redirect somewhere (show page)
    Campground.findByIdAndUpdate(req.params.id, req.body.campground, (err, updatedCampground) => {
        if (err) {
            console.log(err);
            res.redirect('/campgrounds');
        } else {
            res.redirect(`/campgrounds/${req.params.id}`);
        }
    })
})

//middleware
function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    } else {
        res.redirect("/login")
    }

}


module.exports = router;