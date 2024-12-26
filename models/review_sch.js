const { number } = require('joi');
const User = require('./user')
const mongoose = require('mongoose');
const Schema= mongoose.Schema;


const review_sch=new Schema({
    rating: Number,
    msg: String,
    author:{
        type: Schema.Types.ObjectId,
        ref: 'User'
    }
})


module.exports= new mongoose.model('Review', review_sch);