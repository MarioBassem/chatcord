const { Sequelize } = require('sequelize');

module.exports = new Sequelize({
    username: 'superluigi',
    password: 'mario',
    host: 'localhost',
    port: 5432,
    database: 'chat',
    dialect: 'postgres',
    dialectOptions: {
        ssl: {
            require: true,
            rejectUnauthorized: false
          }
    },
    operatorsAlias: false,
    pool: {
        max: 5,
        min: 0, 
        acquire: 30000,
        idle: 10000
    },
    ssl: true,
    storage: './session.postgres'
})