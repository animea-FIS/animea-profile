const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const RatingSchema = new mongoose.Schema({
    value:{
        type: Number,
        required: true,
        unique: false
    },
    rater_user_id:{
        type: Number,
        required: true,
        unique: true
    }
});

//module.exports = mongoose.model('Rating', RatingSchema);
module.exports = RatingSchema;