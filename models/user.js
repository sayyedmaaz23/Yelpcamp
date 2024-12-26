const { required } = require('joi');
const mongoose = require ('mongoose');
const Schema = mongoose.Schema;
const passportlocalmongoose = require('passport-local-mongoose');

const Userschema = new Schema ({
    email:{
        type: String,
        required: true,
        unique: true
    },
    username:{
        type: String,
        required: true, 
        unique: true
    }
})

Userschema.plugin(passportlocalmongoose);

module.exports = new mongoose.model('User', Userschema)