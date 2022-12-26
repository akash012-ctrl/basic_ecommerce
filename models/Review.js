const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
    rating:{
        type:Number
    },
    comment:{
        type:String
    },
    author:String
})

module.exports = mongoose.model('Review',reviewSchema);