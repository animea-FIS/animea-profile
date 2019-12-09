let express = require('express');
let router = express.Router();

let API_PATH_V1 = "";

// Gets user by id
// GET /users/:id
router.get(API_PATH_V1 + '/user/:id', (req, res) => {
    let user_id = req.params.id;
    res.send("Id usuario requerido: " + user_id);
});

// Modifies current user's profile
// PUT /profile/
router.put(API_PATH_V1 + '/profile', (req, res) => {
    var new_name = req.body.name;
    var new_birthdate = req.body.birthdate;
    var new_location = req.body.location;
    var new_bio = req.body.bio;
    var new_presentation_video = req.body.presentation_video;
    var new_presentation_pic = req.body.presentation_pic;
    var new_profile_pic = req.body.profile_pic;
    //TODO
});


module.exports = router