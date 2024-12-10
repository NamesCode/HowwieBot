const sequelize = require('./src/utils/database'); // Import the Sequelize instance
const guild = require('./src/models/guild'); // Import the Guild model

sequelize.sync({ alter: true }) // Sync the database
    .then(() => {
        console.log('Database synced successfully!');
    })
    .catch((error) => {
        console.error('Error syncing the database:', error);
    });