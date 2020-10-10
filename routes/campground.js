var express = require('express');
const campground = require('../models/campground');
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
router.get('/:id/edit', checkCampgroundOwnership, (req, res) => {
    Campground.findById(req.params.id, (err, foundCampground) => {
        res.render('campgrounds/edit', { campground: foundCampground });
    });
});

//UPDATE CAMPGROUND ROUTE
router.put('/:id', checkCampgroundOwnership, (req, res) => {
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
});

//DESTROY CAMPGROUND ROUTE
router.delete('/:id', checkCampgroundOwnership, (req, res) => {
    Campground.findByIdAndRemove(req.params.id, (err) => {
        if (err) {
            console.log(err);
            res.redirect('/campgrounds');
        } else {
            res.redirect('/campgrounds');
        }
    });
});

//middleware
function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    } else {
        res.redirect("/login")
    }

}
//middleware
//is user logged in
//does user own this campground
//otherwise redirect
//if not , redirect it somewhere else 
function checkCampgroundOwnership(req, res, next) {
    if (req.isAuthenticated()) {
        Campground.findById(req.params.id, (err, foundCampground) => {
            if (err) {
                console.log(err);
                res.redirect('back');
            } else {
                //does user own this campground
                if (foundCampground.author.id.equals(req.user._id)) {
                    next();
                } else {
                    res.redirect('back')
                }
            }
        });
    } else {
        res.redirect('back');
    }
}


module.exports = router;