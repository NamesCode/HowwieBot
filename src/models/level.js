const { DataTypes, Model } = require("sequelize");
const sequelize = require("../utils/database");

class Level extends Model {}

Level.init(
  {
    userId: {
      type: DataTypes.STRING,
      primaryKey: true,
    },
    guildId: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    xp: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      allowNull: false,
    },
    level: {
      type: DataTypes.INTEGER,
      defaultValue: 1,
      allowNull: false,
    },
  },
  { sequelize, modelName: "level" }
);

module.exports = Level;
