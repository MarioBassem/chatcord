const sequelize = require('sequelize');
const db = require('../config/database');

const ChatMessages = db.define('chat_messages', {
    id:{
        type: sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    username:{
        type: sequelize.TEXT,
        allowNull: false
    },
    text:{
        type: sequelize.TEXT,
        allowNull: false
    },
    room_id:{
        type: sequelize.INTEGER,
        allowNull: false,
    }
});

ChatMessages.sync().then(() => {
    console.log('ChatMessages table created');
    db.query('create index chat_messages_text on chat_messages using gin (text gin_trgm_ops)').then(dd => {
        console.log('created index');
    }).catch(err => {
        console.log(err);
    });
}).catch(err => {
    console.log(err);
});

module.exports = ChatMessages;

