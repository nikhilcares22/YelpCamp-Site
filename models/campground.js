var mongoose = require('mongoose');

//SCHEMA SETUP  
var campgroundSchema = mongoose.Schema({
    name: String,
    image: String,
    description: String,
    comments: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Comment'
    }]
});

module.exports = new mongoose.model("Campground", campgroundSchema);