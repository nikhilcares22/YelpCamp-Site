var bodyParser = require('body-parser'),
    mongoose = require('mongoose'),
    express = require('express'),
    app = express(),
    passport = require('passport'),
    LocalStrategy = require("passport-local"),
    port = 3000,
    Campground = require('./models/campground'),
    Comment = require('./models/comment'),
    User = require('./models/user'),
    seedDB = require('./seeds');

seedDB();

//passport configuration
app.use(require("express-session")({
    secret: "Once again jumbo is the best",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

mongoose.connect('mongodb://localhost:27017/yelp', { useNewUrlParser: true, useUnifiedTopology: true });

app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs');

app.use(express.static(__dirname + '/public'));
app.use(function(req, res, next) {
    res.locals.currentUser = req.user;
    next();
});

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
//      COMMENTS ROUTES
// ===========================

app.get('/campgrounds/:id/comments/new', isLoggedIn, (req, res) => {
    //find by id and send it through ejs
    Campground.findById(req.params.id, (err, campground) => {
        if (err) {
            console.log(err);
        } else {
            res.render('comments/new', { campground: campground });
        }
    })
});
app.post('/campgrounds/:id/comments', isLoggedIn, (req, res) => {
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

//++++++++++++++++++++++++++
//      AUTH ROUTES
//++++++++++++++++++++++++++

app.get("/register", (req, res) => {
    res.render("register");
});

//handel sign up logic
app.post("/register", (req, res) => {
    var newUser = new User({ username: req.body.username })
    User.register(newUser, req.body.password, (err, user) => {
        if (err) {
            console.log(err);
            return res.render("register");
        }
        passport.authenticate('local')(req, res, () => {
            console.log(user);
            res.redirect("/campgrounds");
        });
    });
});

//show login form

app.get('/login', (req, res) => {
    res.render("login");
});

app.post('/login', passport.authenticate("local", {
    successRedirect: "/campgrounds",
    failureRedirect: "/login"
}), (req, res) => {

});

//LOGOUT ROUTE
app.get('/logout', (req, res) => {
    req.logout();
    res.redirect("/campgrounds");
});

//middleware to check if the user is logged in
function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    } else {
        res.redirect("/login")
    }

}

app.listen(port, () => {
    console.log(`Server running on port ${port}`)
})