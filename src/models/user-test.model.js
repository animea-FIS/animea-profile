const mongoose = require('mongoose');
const RatingSchema = require('./rating.model');

const UserTestSchema = new mongoose.Schema(
    {
        id:{
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            unique: true
        },
        name:{
            type: String,
            required: false,
            unique: false
        },
        username:{
            type: String,
            required: true,
            unique: false
        },
        twitterUsername:{
            type: String,
            required: false,
            unique: false
        },
        email:{
            type: String,
            required: false,
            unique: false
        },
        location:{
            type: String,
            required: false,
            unique: false
        },
        birthdate:{
            type: Date,
            required: true,
            unique: false
        },
        bio:{
            type: String,
            required: false,
            unique: false
        },
        presentationVideo:{
            type: String,
            required: false,
            unique: false
        },
        profilePic:{
            type: String,
            required: false,
            unique: false
        },
        rating:{
            type: Number,
            required: true,
            unique:false,
            default:0
        },
        joined_meetings:{
            type: [mongoose.Schema.Types.ObjectId],
        },
        ratings: [RatingSchema]
    }
);

module.exports = mongoose.model('UserTest', UserTestSchema, 'userTest'); // El tercer parámetro es el nombre de la colección