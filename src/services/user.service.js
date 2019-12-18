'use strict';

//const RatingModel = require('../models/rating.model');
const UserModel = require('../models/user.model');
const request = require('request');

class UserService {
    static getUsers(){
        return new Promise(function(resolve, reject){
            UserModel.find({}).then((doc) => {
                    resolve(doc);
                }).catch((err) => {
                    reject(err);
                });
        });
    };

    static getUserById(userId){
        return new Promise(function(resolve, reject){
            UserModel.findOne({'id':userId}).then((doc) => {
                resolve(doc);
            }).catch((err) => {
                reject(err);
            });
        });
    };

    static updateUserById(user){
        return new Promise(function(resolve, reject){
            UserModel.update({
                'id': user.id
            }, user, function(){
                resolve();
            });
        });
    };
    static getJoinedMeetingsByUser(userId){
        return new Promise(function(resolve, reject){
            UserModel.findOne({
                id: userId,
            }).then((doc) => {
                resolve(doc);
            }).catch((err) => {
                reject(err);
            });
        });
    };
    static addMeetingToUser(userId, meetingId){
        return new Promise(function(resolve, reject){
             UserModel.findOne({
                id: userId
            }, function(err, doc){
                if(err){
                    reject(err);
                }else{
                    if(doc.joined_meetings.includes(meetingId)){
                        resolve(false);
                    }else{
                        doc.joined_meetings.push(meetingId);
                        doc.save();
                        resolve(true);
                    }
                }
            });
        });
    };
    static deleteMeetingToUser(userId, meetingId){
        return new Promise(function(resolve, reject){
             UserModel.findOne({
                id: userId
            }, function(err, doc){
                if(err){
                    reject(err);
                }else{
                    if(doc.joined_meetings.includes(meetingId)){
                        doc.joined_meetings.splice(doc.joined_meetings.indexOf(meetingId), 1);
                        doc.save();
                        resolve(true);
                    }else{
                        resolve(false);
                    }
                }
            });
        });
    };
    /*static addRatingToUser(userRatedId, userRaterId, ratingValue){
        return new Promise(function(resolve, reject){
            let rating = new RatingModel();
            rating.id = 1;
            rating.value = ratingValue;
            rating.rater_user_id = userRaterId;
            rating.save()
                .then((result) => {
                    UserModel.findOne({
                        id: userRatedId
                    }, (err, user) => {
                        if(user){
                            user.ratings.push(rating);
                            user.save();
                            resolve(true);
                        }else{
                            resolve(false);
                        }
                    });
                })
                .catch((error) => {
                    resolve(false)
                });
        });
    };*/
};

module.exports = UserService;