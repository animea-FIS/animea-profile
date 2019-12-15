const UserService = require('../services/user.service.js');
const express = require('express');
const router = express.Router();
const isEmpty = require('../utils').isEmptyObject;
const API_PATH = process.env.API_PATH;



// Gets all users
router.get(API_PATH + '/users', (req, res) => {
    UserService.getUsers().then(function(response){
        res.send(response);
    }, function(err){
        console.log(err);
    });
});


// Gets user by id
// GET /users/:id
router.get(API_PATH + '/profile/:id', (req, res) => {
    const user_id = req.params.id;
    UserService.getUserById(user_id).then(function(response){
        if(isEmpty(response)){
            res.sendStatus(404);
        }else{
            res.send(response);
        }
    }, function(err){
        console.log(err);
    });
});

// Modifies current user's profile
// PUT /profile/
router.put(API_PATH + '/profile', (req, res) => {
    const user = req.body;
    UserService.updateUserById(user).then(function(response){
        res.sendStatus(200);
    }, function(err){
        console.log(err);
    });
});

// Devuelve los ids de los meetings a los que el usuario se ha unido.
// GET /user/:id/joinedMeetings
router.get(API_PATH + '/user/:id/joinedMeetings', (req, res) => {
    const user_id = req.params.id;
    UserService.getUserById(user_id).then(function(response){
        if(isEmpty(response)){
            res.status(204).send('No content');
        }else{
            res.send(response.joined_meetings);
        }
    }, function(err){
        console.log(err);
    });
});

// Pasa la ID de un usuario y meeting para actualizar la lista de meetings a los que asiste, añadiendo el meeting
// PUT /user/:id/joinsMeeting/:meetingId
router.put(API_PATH + '/user/:id/joinsMeeting/:meetingId', (req, res) => {
    const user_id = req.params.id;
    const meeting_id = req.params.meetingId;
    UserService.addMeetingToUser(user_id, meeting_id).then(function(response){
        if(response){
            res.sendStatus(200);
        }else{
            res.status(400).send('User already joined that meeting');
        }
    }, function(err){
        console.log(err);
    });
});

// Pasa la ID de un usuario y meeting para actualizar la lista de meetings a los que asiste, borrando el meeting
// PUT /user/:id/leavesMeeting/:meetingId
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


// Debo borrar datos de profile que no uso como la contraseña, así como crear una tabla que guarde
// los ratings que le de un usuario a otro, y consultar esta tabla para obtener el rating de un usuario.
module.exports = router;