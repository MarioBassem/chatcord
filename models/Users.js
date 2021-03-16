const sequelize = require('sequelize');

const db = require('../config/database');

const Users = db.define('users', {
    id:{
        type: sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: sequelize.TEXT,
        allowNull: false
    },
    email: {
        type: sequelize.TEXT,
        allowNull: false,
    },
    hashed_password: {
        type: sequelize.TEXT,
        allowNull: false
    }
});

Users.sync().then(() => {
    console.log('Users table created');
});


module.exports = Users;