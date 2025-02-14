const { DataTypes, Model } = require("sequelize"); // Import the Datatypes/Model constructors from Sequelize
const sequelize = require("../utils/database"); // Import your Sequelize instance from database.js

class Guild extends Model {}

Guild.init(
  {
    id: {
      type: DataTypes.STRING,
      primaryKey: true,
    },
    welcomeRoleId: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  { sequelize, modelName: "guild" }
);

module.exports = Guild;
