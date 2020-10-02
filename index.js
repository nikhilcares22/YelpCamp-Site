var bodyParser = require('body-parser'),
    mongoose = require('mongoose'),
    express = require('express'),
    app = express(),
    port = 3000;

mongoose.connect('mongodb://localhost:27017/yelp', { useNewUrlParser: true });

app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs');

//SCHEMA SETUP  
var campgroundSchema = mongoose.Schema({
    name: String,
    image: String,
    description: String
});

var Campground = new mongoose.model("Campground", campgroundSchema);


app.get('/', (req, res) => {
    res.render("landing");
});

//SHOW ALL CAMPGROUNDS
app.get('/campgrounds', (req, res) => {
    Campground.find({}, (err, campgrounds) => {
        if (err) {
            console.log(err);
        } else {
            res.render("index", { campgrounds: campgrounds });
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
    res.render('new.ejs')
});

//SHOW - show more info about one campground
app.get('/campgrounds/:id', (req, res) => {
    //find the campground with the specified id in the params
    //render show template with that compound
    Campground.findById(req.params.id, (err, foundCampground) => {
        if (err) {
            console.log(err);
        } else {
            console.log(foundCampground);
            res.render("show", { campground: foundCampground });
        }
    })

});

app.listen(port, () => {
    console.log(`Server running on port ${port}`)
})