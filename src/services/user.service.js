'use strict';

//const RatingModel = require('../models/rating.model');
const UserModel = require('../models/user.model');
const request = require('request');

class UserService {
    static getUsers(){
        return new Promise(function(resolve, reject){
            UserModel.find({}, (err, profiles) => {
                if(err){
                    console.log(Date() + "-"+err);
                    reject(err);
                }else{
                    resolve(profiles);
                }
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

    static createUser(user){
        return new Promise(function(resolve, reject){
            UserModel.findOne({
                id: user.id
            }, function(err, doc){
                if(err){
                    reject(err);
                } else if(doc != null){
                    resolve(false);
                }else{
                    UserModel.create({
                        id: user.id,
                        username: user.username,
                        name: user.name,
                        email: user.email,
                        location: user.location,
                        birthdate: user.birthdate,
                        bio: user.bio,
                        presentationVideo: user.presentationVideo,
                        profilePic: user.profilePic,
                        ratings: user.ratings,
                        rating: user.rating,
                        joined_meetings: user.joined_meetings
                    }, function(err, user){
                        if(err){
                            resolve(false);
                        }else{
                            resolve(true);
                        }
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
                        let meetingsList = doc.joined_meetings;
                        meetingsList.push(meetingId);
                        UserModel.updateOne({
                            id: userId
                        }, {joined_meetings: meetingsList}, (err, raw) => {
                            if(err){
                                resolve(false);
                            }else{
                                resolve(true);
                            }
                        });
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
                    let meetingsList = doc.joined_meetings;
                    if(meetingsList.includes(meetingId)){
                        meetingsList.splice(meetingsList.indexOf(meetingId), 1)
                        UserModel.updateOne({
                            id: userId
                        }, {joined_meetings: meetingsList}, (err, raw) => {
                            if(err){
                                resolve(false);
                            }else{
                                resolve(true);
                            }
                        });
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
                    if(ratings_number === 0){
                        resolve(0);
                    }else{
                        for(let i = 0; i < ratings_number; i++){
                            total = total + doc.ratings[i].value;
                        }
                        resolve((total/ratings_number).toPrecision(2));
                    }
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
                    let ratingsList = doc.ratings;
                    let totalRatingValue = 0;
                    
                    ratingsList.push({rater_user_id: userRaterId, value: ratingValue});
                    const ratings_number = ratingsList.length;
                    for(let i = 0; i < ratings_number; i++){
                        totalRatingValue = totalRatingValue + doc.ratings[i].value;
                    }

                    UserModel.updateOne({
                        id: userRatedId
                    }, {ratings: ratingsList, rating: (totalRatingValue/ratings_number)}, (err, raw) => {
                        if(err){
                            resolve(false);
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