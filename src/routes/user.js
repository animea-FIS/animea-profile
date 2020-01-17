const UserService = require('../services/user.service.js');
const express = require('express');
const router = express.Router();
const cache = require('memory-cache');
const isEmpty = require('../utils').isEmptyObject;
const API_PATH = process.env.API_PATH;

/**
 * @typedef User
 * @property {object} id.required - Identifier of the user
 * @property {string} name.required - Name of the user
 * @property {string} username.required - Username of the user
 * @property {string} twitterUsername - Twitter's username of the user
 * @property {string} email - Email of the user
 * @property {string} location - Place where the user lives
 * @property {date} birthdate - Birthdate of the user
 * @property {string} bio - Biography of the user
 * @property {string} presentationVideo - Video that the user has visible in his profile
 * @property {string} profilePic - Url of the profile picture of the user
 * @property {number} rating - Rating of the user, by votes of other users
 * @property {object} joined_meetings - An array of the meetings id the user has joined
 * @property {object} ratings - An array of the ratings that the user has received.
 */

 /**
 * @typedef Rating
 * @property {integer} value.required - Value of the rating (from 1 to 5)
 * @property {object} rater_user_id.required - Id of the user who created the rating
 */

/**
 * @route GET /users
 * @group User - Operations about Users
 * @returns {object} 200 - An array with the found users of the system
 * @returns {Error}  default - Unexpected error
 */
router.get(API_PATH + '/users', (req, res) => {
    cacheKey = `getUsers`;
    cachedBody = cache.get(cacheKey);
    if(!cachedBody){
        UserService.getUsers().then(function(response){
            res.send(response);
        }, function(err){
            console.log(err);
        });
    }else{
        console.log("Using cache...")
        res.json(cachedBody);
    }
});


// Gets user by id
/**
 * @route GET /profile/:id
 * @group User - Operations about Users
 * @param {string} id.query.required - Identifier of the user
 * @returns {object} 200 - JSON object with information about the anime found
 * @returns {Error}  404 - User not found
 */
router.get(API_PATH + '/profile/:id', (req, res) => {
    const user_id = req.params.id;
    cacheKey = `getUser:${user_id}`;
    cachedBody = cache.get(cacheKey);
    if(!cachedBody){
        UserService.getUserById(user_id).then(function(response){
            if(isEmpty(response)){
                res.sendStatus(404);
            }else{
                res.send(response);
            }
        }, function(err){
            console.log(err);
        });
    }else{
        console.log('Using cache...');
        res.json(cachedBody);
    }
    
});

// Modifies current user's profile
/**
 * @route PUT /profile
 * @group User - Operations about Users
 * @param {string} user.query.required - User body to update the user
 * @returns {object} 200 - The user was properly updated
 * @returns {Error}  404 - User not found
 */
router.put(API_PATH + '/profile', (req, res) => {
    const user = req.body;
    UserService.updateUserById(user).then(function(response){
        if(response){
            res.sendStatus(200);
        }else{
            res.sendStatus(404);
        }
    }, function(err){
        console.log(err);
    });
});

//Creates new user's profile
/**
 * @route POST /newProfile
 * @group User - Operations about Users
 * @param {string} user.query.required - User to save into the system
 * @returns {object} 201 - The user was properly created
 * @returns {Error}  406 - Error creating the user: he or she already exists or the fields are wrong
 */
router.post(API_PATH + '/newProfile', (req, res) => {
    const user = req.body;
    UserService.createUser(user).then(function(response){
        if(response){
            res.sendStatus(201);
        }else{
            res.status(406).send("Error creating the user: he or she already exists or the fields are wrong.");
        }
    });
    
});

// Devuelve el rating de un usuario
/**
 * @route GET /rating/profile/:id
 * @group User - Operations about Users
 * @param {string} id.query.required - Identifier of the user
 * @returns {object} 200 - JSON object with information about the rating of the user
 * @returns {Error}  404 - User not found
 */
router.get(API_PATH + '/rating/profile/:id', (req, res) => {
    const user_id = req.params.id;
    cacheKey = `getRating:${user_id}`;
    cachedBody = cache.get(cacheKey);
    if(!cachedBody){
        UserService.getRatingUser(user_id).then(function(response){
            if(response == -1){
                res.sendStatus(404);
            }else{
                res.status(200).send({'rating': response});
            }
        }, function(err){
            console.log(err);
        });
    }else{
        console.log('Using cache...');
        res.json(cachedBody);
    }
});

// Añade un rating al perfil de un usuario
/**
 * @route PUT /rating/profile/:id
 * @group User - Operations about Users
 * @param {string} id.query.required - Id of the user to add the rating
 * @param {string} my_id.query.required - Id of the user who created the rating
 * @param {string} rating_value.query.required - value of the rating
 * @returns {object} 201 - The new rating was properly created
 * @returns {Error}  404 - User not found
 */
router.put(API_PATH + '/rating/profile/:id', (req, res) => {
    const user_rated_id = req.params.id;
    const user_rater_id = req.body.my_id; //TODO Cambiar por la ID del usuario conectado actualmente
    const rating_value = req.body.rating_value;
    UserService.addRatingToUser(user_rated_id, user_rater_id, rating_value)
        .then(function(response){
            if(response){
                res.status(201).send('User rated correctly');
            }else{
                res.status(404).send('User not found');
            }
        }, function(err){
            console.log(err);
        });
});

// Devuelve los ids de los meetings a los que el usuario se ha unido.
/**
 * @route GET /user/:id/joinedMeetings
 * @group User - Operations about Users
 * @param {string} id.query.required - Identifier of the user
 * @returns {object} 200 - JSON object that contains an array with the ids of the meetings that the user has joined
 * @returns {Error}  404 - User not found
 */
router.get(API_PATH + '/user/:id/joinedMeetings', (req, res) => {
    const user_id = req.params.id;
    cacheKey = `getJoinedMeetings:${user_id}`;
    cachedBody = cache.get(cacheKey);
    if(!cachedBody){
        UserService.getUserById(user_id).then(function(response){
            if(! response){
                res.status(404).send('User not found');
            }else{
                res.send(response.joined_meetings);
            }
        }, function(err){
            console.log(err);
        });
    }else{
        console.log('Using cache...');
        res.json(cachedBody);
    }
});

// Pasa la ID de un usuario y meeting para actualizar la lista de meetings a los que asiste, añadiendo el meeting
/**
 * @route PUT /user/:id/joinsMeeting/:meetingId
 * @group User - Operations about Users
 * @param {string} id.query.required - Id of the user to add the meeting
 * @param {string} meetingId.query.required - Id of the meeting to be joined
 * @returns {object} 200 - The meeting was properly added to the user
 * @returns {Error}  400 - The meeting is invalid or user already joined it
 */
router.put(API_PATH + '/user/:id/joinsMeeting/:meetingId', (req, res) => {
    const user_id = req.params.id;
    const meeting_id = req.params.meetingId;
    UserService.addMeetingToUser(user_id, meeting_id).then(function(response){
        if(response){
            res.sendStatus(200);
        }else{
            res.status(400).send('The meeting is invalid or user already joined it.');
        }
    }, function(err){
        console.log(err);
    });
});

// Pasa la ID de un usuario y meeting para actualizar la lista de meetings a los que asiste, borrando el meeting
/**
 * @route PUT /user/:id/leavesMeeting/:meetingId
 * @group User - Operations about Users
 * @param {string} id.query.required - Id of the user to remove the meeting
 * @param {string} meetingId.query.required - Id of the meeting to be removed
 * @returns {object} 200 - The meeting was properly removed from the user
 * @returns {Error}  400 - User has not joined that meeting
 */
router.put(API_PATH + '/user/:id/leavesMeeting/:meetingId', (req, res) => {
    const user_id = req.params.id;
    const meeting_id = req.params.meetingId;
    UserService.deleteMeetingToUser(user_id, meeting_id).then(function(response){
        if(response){
            res.sendStatus(200);
        }else{
            res.status(400).send('User has not joined that meeting');
        }
    }, function(err){
        console.log(err);
    });
});


// Get last tweet by twitter username
/**
 * @route GET /profile/tweet/:tw_username
 * @group User - Operations about Users
 * @param {string} tw_username.query.required - Twitter's username of the user
 * @returns {object} 200 - JSON object that contains the las tweet from the user
 * @returns {Error}  404 - User not found or he does not have Twitter username.
 */
router.get(API_PATH + '/profile/tweet/:tw_username', (req, res) => {
    const tw_username = req.params.tw_username;
    cacheKey = `getLastTweet:${tw_username}`;
    cachedBody = cache.get(cacheKey);
    if(!cachedBody){
        UserService.getLastTweetByUsername(tw_username).then(function(response){
            if(isEmpty(response)){
                res.sendStatus(404);
            }else{
                res.send(response);
            }
        }, function(err){
            res.sendStatus(404);
        });
    }else{
        console.log('Using cache...');
        res.json(cachedBody);
    }
});

module.exports = router;