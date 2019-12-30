const mongoose = require('mongoose');

const RatingSchema = new mongoose.Schema({
    value:{
        type: Number,
        required: true,
        unique: false
    },
    rater_user_id:{
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        unique: true
    }
});

module.exports = RatingSchema;