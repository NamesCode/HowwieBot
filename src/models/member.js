const { Sequelize } = require('sequelize'); // Import the Sequelize constructor
const sequelize = require('../utils/database'); // Import your Sequelize instance from database.js

const Member = sequelize.define('member', {
    id: {
        type: Sequelize.STRING, 
        primaryKey: true,
    },
    guildId: {
        type: Sequelize.STRING, 
        allowNull: true,
    },
});

module.exports = Member;
