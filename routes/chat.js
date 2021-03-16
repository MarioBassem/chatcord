const express = require('express');
const router = express.Router();
const {ensureAuthenticated} = require('../config/auth');
const Room = require('../models/Rooms');
const chatMessages = require('../models/ChatMessages');
const { Op } = require("sequelize");

router.get('/', ensureAuthenticated, (req, res) => {
    const roomName = req.query.room;
    const username = req.user.name;
    const errors = [];
    Room.findOne({where: {title: roomName}}).then(room => {
        if(room){
            req.user.room = room.id;
            chatMessages.findAll({where: {room_id: room.id}, limit: 30, order: [['createdAt', 'DESC']]}).then(messages => {
                res.render('chat', {messages: messages.reverse(), room: room.id});
            }).catch(err => {
                console.log(err);
            });
        }else{
            errors.push({msg: 'Room does not exist'});
            res.render('dashboard', {errors, name: username});
        }
    }).catch(err => {
        console.log(err);
    })
});

router.post('/', ensureAuthenticated, (req, res) => {
    const search_term = req.body.search_term;
    const room_id = parseInt(req.body.room_id, 10);
    chatMessages.findAll({
        where : {
            text: {
                [Op.substring]: search_term
            }, 
            room_id: room_id 
        }, 
        limit: 30, 
        order: [['createdAt', 'DESC']]
    }).then(result => {
        res.setHeader('Content-type', 'application/json');
        res.end(JSON.stringify({result: result.reverse()}));
    }).catch(err => {
        console.log(err);
    });
})



module.exports = router;