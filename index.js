var bodyParser = require('body-parser'),
    mongoose = require('mongoose'),
    express = require('express'),
    app = express(),
    passport = require('passport'),
    flash = require('connect-flash'),
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

// mongoose.connect('mongodb://localhost:27017/yelp', { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false });
mongoose.connect('mongodb+srv://nikhil:nehminilu@cluster0.udzon.mongodb.net/yelpcamp?retryWrites=true&w=majority', { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false });

app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs');

app.use(express.static(__dirname + '/public'));
app.use(methodOverride('_method'));
app.use(flash());
app.use(function(req, res, next) {
    res.locals.currentUser = req.user;
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    next();
});


app.use('/', indexRoutes);
app.use('/campgrounds', campgroundRoutes);
app.use('/campgrounds/:id/comments', commentRoutes);

// // app.listen(port, () => {
// //     console.log(`Server running on port ${port}`)
// });
app.listen(process.env.PORT, process.env.IP);