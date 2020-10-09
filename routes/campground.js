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
router.post('/', (req, res) => {
    //get data from form and add to the campgrounds get request and redirect to the campgrounds
    var name = req.body.name;
    var image = req.body.image;
    var description = req.body.description;
    var newCampground = { name: name, image: image, description: description }
    Campground.create(newCampground, (err, result) => {
        if (err) {
            console.log(err);
        } else {
            console.log(`added a new Campground via form`);
            console.log(result);
            res.redirect('/campgrounds');
        }
    })

});

//DISPLAY A FORM TO CREATE A NEW CAMPGROUND
router.get('/new', (req, res) => {
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

module.exports = router;