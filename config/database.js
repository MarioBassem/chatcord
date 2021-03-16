const { Sequelize } = require('sequelize');
module.exports = new Sequelize('postgres://eyjniqjefphkbd:bf65ee617723ae281fe3dfaf87f565f152048b4a18c42605be99271d17d713a8@ec2-54-162-119-125.compute-1.amazonaws.com:5432/daton5rsp5gqgf', {
    host: 'c2-54-162-119-125.compute-1.amazonaws.com',
    dialect: 'postgres',
    operatorsAlias: false,
    pool: {
        max: 5,
        min: 0, 
        acquire: 30000,
        idle: 10000
    },
    ssl: true
});

// postgres://superluigi:mario@localhost:5432/chat