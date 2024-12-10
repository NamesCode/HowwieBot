const { Sequelize } = require('sequelize'); // Use destructuring to get the Sequelize constructor

const sequelize = new Sequelize('database', 'user', 'password', {
    dialect: 'sqlite',
    host: 'localhost',
    storage: 'database.sqlite',
    logging: false,
});

module.exports = sequelize;
