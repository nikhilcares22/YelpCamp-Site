var bodyParser = require('body-parser')
var express = require('express')
var app = express();
let port = 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs');

var campgrounds = [
    { name: "Salmon creek", image: "https://images.unsplash.com/photo-1537905569824-f89f14cceb68?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60" },
    { name: "Granite Hill", image: "https://images.unsplash.com/photo-1529260294141-4e30f9287ec3?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60" },
    { name: "Mountain Goat's Rest", image: "https://images.unsplash.com/photo-1536002583490-9857862b246b?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60" },
    { name: "Salmon creek", image: "https://images.unsplash.com/photo-1537905569824-f89f14cceb68?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60" },
    { name: "Granite Hill", image: "https://images.unsplash.com/photo-1529260294141-4e30f9287ec3?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60" },
    { name: "Mountain Goat's Rest", image: "https://images.unsplash.com/photo-1536002583490-9857862b246b?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60" },
    { name: "Salmon creek", image: "https://images.unsplash.com/photo-1537905569824-f89f14cceb68?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60" },
    { name: "Granite Hill", image: "https://images.unsplash.com/photo-1529260294141-4e30f9287ec3?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60" },
    { name: "Mountain Goat's Rest", image: "https://images.unsplash.com/photo-1536002583490-9857862b246b?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60" }

]

app.get('/', (req, res) => {
    res.render("landing");
});

app.get('/campgrounds', (req, res) => {

    res.render("campgrounds", { campgrounds: campgrounds });
});

app.post('/campgrounds', (req, res) => {
    //get data from form and add to the campgrounds get request and redirect to the campgrounds
    var name = req.body.name;
    var image = req.body.image;
    var newCampground = { name: name, image: image }
    campgrounds.push(newCampground);
    res.redirect('/campgrounds');

});

app.get('/campgrounds/new', (req, res) => {
    res.render('new.ejs')
});
console.log('hello')

app.listen(port, () => {
    console.log(`Server running on port ${port}`)
})