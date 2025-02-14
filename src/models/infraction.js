const { DataTypes, Model } = require("sequelize"); // Import the Datatypes/Model constructors from Sequelize
const sequelize = require("../utils/database"); // Import Sequelize instance from database.js

class Infraction extends Model {}

Infraction.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    guildId: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    reason: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: "No reason provided",
    },
    enforcerId: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    type: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    duration: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    // memberId from Member.hasMany relationship
  },
  { sequelize, modelName: "infraction" }
);

module.exports = Infraction;
