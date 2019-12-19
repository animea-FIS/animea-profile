const mongoose = require('mongoose');
const RatingSchema = require('./rating.model');

const UserSchema = new mongoose.Schema(
    {
        id:{
            type: Number,
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

module.exports = mongoose.model('User', UserSchema, 'user'); // El tercer parámetro es el nombre de la colección