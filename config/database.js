const { Sequelize } = require('sequelize');

module.exports = new Sequelize({
    username: 'eyjniqjefphkbd',
    password: 'bf65ee617723ae281fe3dfaf87f565f152048b4a18c42605be99271d17d713a8',
    host: 'ec2-54-162-119-125.compute-1.amazonaws.com',
    port: 5432,
    database: 'daton5rsp5gqgf',
    dialect: 'postgres',
    dialectOptions: {
        ssl: true,
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

// postgres://superluigi:mario@localhost:5432/chat
// module.exports = new Sequelize({
//     username: 'superluigi',
//     password: 'mario',
//     host: 'localhost',
//     port: 5432,
//     database: 'chat',
//     dialect: 'postgres',
//     operatorsAlias: false,
//     pool: {
//         max: 5,
//         min: 0, 
//         acquire: 30000,
//         idle: 10000
//     },
//     ssl: true,
//     storage: './session.postgres'
// })