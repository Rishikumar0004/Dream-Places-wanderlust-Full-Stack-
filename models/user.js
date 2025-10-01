const { required } = require("joi");
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const passportLocalMongoose = require("passport-local-mongoose");

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
    },
    username: { type: String, required: true, unique: true },
});

userSchema.plugin(passportLocalMongoose, { usernameField: 'email' });
//it automatically implement username,salting,hashing and password

module.exports = mongoose.model('User', userSchema);