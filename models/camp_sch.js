
const mongoose = require('mongoose');
const Schema= mongoose.Schema;
const Review= require('./review_sch');
const User = require('./user');
const { coordinates } = require('@maptiler/client');
const { required } = require('joi');


const opts = { toJSON: { virtuals: true } };

const Imgschema= new Schema({
        url: String,
        imgname: String
})

Imgschema.virtual('thumbnail').get(function (){
   return this.url.replace('/upload', '/upload/w_200')
})
const camp_sch= new Schema({
    title: {
        type: String,
        required:[true, 'Add a Name to it']
    },
    price: Number,
    images: [Imgschema],
    geometry:{
        type:{
            type: String,
            enum: ['Point'],
            required: true
        },
        coordinates:{
            type: [Number],
            required: true
        }
    },
    description: String,
    location: String,
    author: {
        type: Schema.Types.ObjectId,
         ref: 'User'
    },
    review: [
        {type: Schema.Types.ObjectId,
            ref: 'Review'
         } 
    ]
    
}, opts);

camp_sch.virtual('properties.popUpMarkup').get(function () {
    return `<a href= '/campgrounds/${this._id}'>${this.title}</a> <br> <p>${this.description.substring(0, 25)}...</p>` 
    
})

camp_sch.post('findOneAndDelete', async function (doc) {
    
    if(doc.review){
        try{
            await Review.deleteMany({
                _id:{$in: doc.review}
            })
        } catch (e){
            console.log(e)
        }
        }
})

module.exports= new mongoose.model('Campground' ,camp_sch);
