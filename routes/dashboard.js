const express = require('express');
const router = express.Router();
const {ensureAuthenticated} = require('../config/auth');
const Room = require('../models/Rooms');

router.get('/', ensureAuthenticated, (req, res) => {
    res.render('dashboard', {
        name: req.user.name
    });
});

router.post('/', ensureAuthenticated, (req, res) => {
    const newRoom = req.body.new_room_name;
    const username = req.user.name;
    const errors = [];
    Room.findOne({where: {title: newRoom}}).then(room => {
        if(room){
            errors.push({msg: 'Room already exists'});
            res.render('dashboard', {errors, name: username});
        }else{
            Room.create({
                title: newRoom
            }).then(r => {
                res.redirect(`/chat?room=${newRoom}&username=${req.user.name}`);
            }).catch(err => {
                console.log(err);
            });
        }
    }).catch(err => {
        console.log(err);
    })
});



module.exports = router;