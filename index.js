var bodyParser = require('body-parser'),
    mongoose = require('mongoose'),
    express = require('express'),
    app = express(),
    passport = require('passport'),
    methodOverride = require('method-override'),
    LocalStrategy = require("passport-local"),
    port = 3000,
    Comment = require('./models/comment'),
    User = require('./models/user'),
    seedDB = require('./seeds');

// seedDB(); //seed the database 

//requiring routes
var commentRoutes = require('./routes/comments'),
    campgroundRoutes = require('./routes/campground'),
    indexRoutes = require('./routes/index');

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

mongoose.connect('mongodb://localhost:27017/yelp', { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false });

app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs');

app.use(express.static(__dirname + '/public'));
app.use(methodOverride('_method'));
app.use(function(req, res, next) {
    res.locals.currentUser = req.user;
    next();
});


app.use('/', indexRoutes);
app.use('/campgrounds', campgroundRoutes);
app.use('/campgrounds/:id/comments', commentRoutes);

app.listen(port, () => {
    console.log(`Server running on port ${port}`)
})