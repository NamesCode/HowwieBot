const { DataTypes, Model } = require("sequelize"); // Import the Datatypes/Model constructors from Sequelize
const sequelize = require("../utils/database"); // Import your Sequelize instance from database.js

class Member extends Model {}

Member.init(
  {
    id: {
      type: DataTypes.STRING,
      primaryKey: true,
    },
    guildId: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  { sequelize, modelName: "member" }
);

module.exports = Member;
