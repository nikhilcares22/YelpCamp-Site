var bodyParser = require('body-parser'),
    mongoose = require('mongoose'),
    express = require('express'),
    app = express(),
    port = 3000,
    Campground = require('./models/campground'),
    Comment = require('./models/comment'),
    User = require('./models/user'),
    seedDB = require('./seeds');

seedDB();

mongoose.connect('mongodb://localhost:27017/yelp', { useNewUrlParser: true, useUnifiedTopology: true });

app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs');

app.use(express.static(__dirname + '/public'));

app.get('/', (req, res) => {
    res.render("landing");
});

//SHOW ALL CAMPGROUNDS
app.get('/campgrounds', (req, res) => {
    Campground.find({}, (err, campgrounds) => {
        if (err) {
            console.log(err);
        } else {
            res.render("campgrounds/index", { campgrounds: campgrounds });
        }
    })

});

//ADD NEW CAMPGROUNDS TO DATABASE
app.post('/campgrounds', (req, res) => {
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
app.get('/campgrounds/new', (req, res) => {
    res.render('campgrounds/new.ejs')
});

//SHOW - show more info about one campground
app.get('/campgrounds/:id', (req, res) => {
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

// ===========================
//COMMENTS ROUTES
// ===========================

app.get('/campgrounds/:id/comments/new', (req, res) => {
    //find by id and send it through ejs
    Campground.findById(req.params.id, (err, campground) => {
        if (err) {
            console.log(err);
        } else {
            res.render('comments/new', { campground: campground });
        }
    })
});
app.post('/campgrounds/:id/comments', (req, res) => {
    //lookup campgrounds by id
    //create new comments
    //connect new comments to campgrounds
    //redirect campground showpage
    Campground.findById(req.params.id, (err, campground) => {
        if (err) {
            console.log(err);
            res.redirect("/campgrounds")
        } else {
            Comment.create(req.body.comment, (err, comment) => {
                if (err) {
                    console.log(err)
                } else {
                    campground.comments.push(comment);
                    campground.save();
                    res.redirect(`/campgrounds/${campground._id}`);
                }
            })

        }
    })


});

app.listen(port, () => {
    console.log(`Server running on port ${port}`)
})