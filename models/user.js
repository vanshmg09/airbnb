const { required } = require("joi");
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
// To require passport-local-momgoose
const passportLocalMongoose = require("passport-local-mongoose");

const userSchema = new Schema({
    email: {
        type: String,
        required: true
    }
});

userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', userSchema);