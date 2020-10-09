var mongoose = require('mongoose');
var passportLocalMongosoe = require('passport-local-mongoose');

var userSchema = mongoose.Schema({
    username: String,
    password: String
});

userSchema.plugin(passportLocalMongosoe);

module.exports = mongoose.model("User", userSchema);