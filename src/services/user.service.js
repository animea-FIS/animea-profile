'use strict';

//const RatingModel = require('../models/rating.model');
const UserModel = require('../models/user.model');
const request = require('request');
const cache = require('memory-cache');
const API_PATH = process.env.API_PATH;

class UserService {
    static getUsers(){
        var cachedBody = cache.get('getUsers');
        return new Promise(function(resolve, reject){
            if (!cachedBody) {
                UserModel.find({}, (err, profiles) => {
                    if(err){
                        console.log(Date() + "-"+err);
                        reject(err);
                    }else{
                        cache.put('getUsers',profiles, 86400000) // the cache will be stored 24h
                        resolve(profiles);
                    }
                });
            }else{
                console.log("Using cache...")
                resolve(cachedBody);
            }
        });
    };

    static getUserById(userId){
        var cachedBody = cache.get(`getUser:${userId}`);
        return new Promise(function(resolve, reject){
            if (!cachedBody) {
                UserModel.findOne({
                    id: userId
                }, function(err, doc){
                    if(err){
                        reject(err);
                    } else if(doc == null){
                        resolve(false);
                    }else{
                        cache.put(`getUser:${userId}`,doc, 86400000) // the cache will be stored 24h
                        resolve(doc);
                    }
                });
            }else{
                console.log("Using cache...")
                resolve(cachedBody);
            }
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
                        twitterUsername: user.twitterUsername,
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
        var cachedBody = cache.get(`getJoinedMeetings:${userId}`);
        return new Promise(function(resolve, reject){
            if(!cachedBody){
                UserModel.findOne({
                    id: userId,
                }).then((doc) => {
                    cache.put(`getJoinedMeetings:${userId}`,doc, 86400000) // the cache will be stored 24h
                    resolve(doc);
                }).catch((err) => {
                    reject(err);
                });
            }else{
                console.log("Using cache...")
                resolve(cachedBody);
            }
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
        var cachedBody = cache.get(`getRating:${userId}`);
        return new Promise(function(resolve, reject){
            if(!cachedBody){
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
                            cache.put(`getRating:${userId}`,(total/ratings_number).toPrecision(2), 86400000) // the cache will be stored 24h
                            resolve((total/ratings_number).toPrecision(2));
                        }
                    }
                })
            }else{
                console.log("Using cache...")
                resolve(cachedBody);
            }
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

    static getLastTweetByUsername(username) {
        var cachedBody = cache.get(`getLastTweet:${username}`);
        return new Promise(function (resolve, reject) {
            if(!cachedBody){
                const options = {
                    url: `https://api.twitter.com/1.1/statuses/user_timeline.json?screen_name=${username}&count=1`,
                    headers: {
                      'User-Agent': 'request',
                      'Authorization': 'Bearer AAAAAAAAAAAAAAAAAAAAAIcSBwEAAAAA0lF9E9rnrH3Y442RX6devBqoXBc%3DCXSpuXALF7qBCfeMNcASfytrveuUvCTKWaDBl7sRFqbLLQCCZV'
                    }
                  };
                  
                  function callback(error, response, body) {
                    if (!error && response.statusCode == 200) {
                      const info = JSON.parse(body);
                      const tweet = info[0].text;
                      const respuesta = {"lastTweet": tweet};
                      cache.put(`getLastTweet:${username}`,respuesta, 86400000) // the cache will be stored 24h
                      resolve(respuesta);
                    }else{
                        reject(error);
                    }
                  }
                  request(options, callback);
            }else{
                console.log("Using cache...")
                resolve(cachedBody);
            }
            
        });
    };
};

module.exports = UserService;