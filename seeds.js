var mongoose = require('mongoose'),
    Campground = require('./models/campground'),
    Comment = require('./models/comment')

var data = [{
        name: "Cloud's Rest",
        image: "https://images.unsplash.com/photo-1504851149312-7a075b496cc7?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60",
        description: "blh blash blah"
    },
    {
        name: "Desert Mexica",
        image: "https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60",
        description: "blh blash blah"
    },
    {
        name: "Canyon Floor",
        image: "https://images.unsplash.com/photo-1471115853179-bb1d604434e0?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60",
        description: "blh blash blah"
    },
]

function seedDB() {
    //REMOVE ALL THE CAMPGROUNDS
    Campground.deleteMany({}, (err) => {
        if (err) {
            console.log(err);
        }
        Comment.deleteMany({}, (err) => {
            if (err) {
                console.log(err)
            } else {
                //ADD A FEW  CAMPGROUNDS

                data.forEach((seed) => {

                    Campground.create(seed, (err, campground) => {
                        if (err) {
                            console.log(err);
                        } else {
                            //ADD A FEW  COMMENTS
                            Comment.create({
                                text: "This place is great, but i wish there is internet",
                                author: "Homer"
                            }, (err, comment) => {
                                if (err) {
                                    console.log(err);
                                } else {
                                    campground.comments.push(comment);
                                    campground.save();
                                }
                            })
                        }
                    });

                });

            }
        })


    });
}









module.exports = seedDB;