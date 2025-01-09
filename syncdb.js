const sequelize = require('./src/utils/database'); // Import the Sequelize instance
const Guild = require('./src/models/guild'); // Import the Guild model
const Infraction = require('./src/models/infraction');
const Member = require('./src/models/member');

// Associations
Member.hasMany(Infraction);
Infraction.belongsTo(Member);

// Sync all models (alter instead of force to avoid dropping tables)
sequelize.sync({ alter: true })
    .then(() => {
        console.log('Database synced successfully!');
    })
    .catch((error) => {
        console.error('Error syncing the database:', error);
    });

// Sync specific models (force: true to drop and recreate tables)
Infraction.sync({ force: true });
Member.sync({ force: true });
// You can uncomment this if you need to sync Guild as well:
// Guild.sync({ force: true });
