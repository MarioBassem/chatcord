const sequelize = require('sequelize');

const db = require('../config/database')

const Rooms = db.define('room', {
    id: {
        type: sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    title: {
        type: sequelize.STRING,
        allowNull: false,
        unique: true,
    },

});

Rooms.sync().then(() => {
    console.log('Rooms table created');
});

module.exports = Rooms;
