const { Sequelize } = require('sequelize'); // Import the Sequelize constructor
const sequelize = require('../utils/database'); // Import your Sequelize instance from database.js

const Guild = sequelize.define('guild', {
    id: {
        type: Sequelize.STRING, 
        primaryKey: true,
    },
    welcomeRoleId: {
        type: Sequelize.STRING, 
        allowNull: true,
    },
});

module.exports = Guild;
