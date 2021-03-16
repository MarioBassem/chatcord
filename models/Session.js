const sequelize = require('sequelize');
const db = require('../config/database');

const mappings = {
    sid: {
      type: sequelize.STRING,
      primaryKey: true,
    },
    expires: sequelize.DATE,
    data: sequelize.STRING(50000),
  };
	
const Session = db.define('Session', mappings, {
    indexes: [
        {
        name: 'session_sid_index',
        method: 'BTREE',
        fields: ['sid'],
        },
    ],
});

Session.sync().then(() => {
    console.log('Sessions table created');
});

module.exports = Session;

