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
            UserModel.findOne({
                id: userId
            }, function(err, doc){
                if(err){
                    reject(err);
                } else if(doc == null){
                    resolve(false);
                }else{
                    resolve(doc);
                }
            });
        });
    };

    static updateUserById(user){
        return new Promise(function(resolve, reject){
            UserModel.findOne({
                id: user.id
            }, function(err, doc){
                if(err){
                    reject(err);
                } else if(doc == null){
                    resolve(false);
                }else{
                    UserModel.updateOne({
                        id: user.id
                    }, user, function(){
                        resolve(true);
                    });
                }
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
                    if(meetingId <= 0 || doc.joined_meetings.includes(meetingId)){
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

    static getRatingUser(userId){
        return new Promise(function(resolve, reject){
            UserModel.findOne({
                id: userId
            }, function(err, doc){
                if(err){
                    reject(err);
                }else if(doc == null){
                    resolve(-1);
                }else{
                    let total = 0;
                    const ratings_number = doc.ratings.length;
                    for(let i = 0; i < ratings_number; i++){
                        total = total + doc.ratings[i].value;
                    }
                    resolve((total/ratings_number).toPrecision(2));
                }
            })
        });
    };

    static addRatingToUser(userRatedId, userRaterId, ratingValue){
        return new Promise(function(resolve, reject){
            UserModel.findOne({
                id: userRatedId
            }, function(err, doc){
                if(err){
                    reject(err);
                } else if(doc == null){
                    resolve(false);
                }else{
                    doc.ratings.push({rater_user_id: userRaterId, value: ratingValue});
                    doc.save(function (err){
                        if(err){
                            reject(err);
                        }else{
                            resolve(true);
                        }
                    });
                }
            });
        });
    };
};

module.exports = UserService;