var Sequelize = require("sequelize");
var sequelize = require("../routes/db.js");
var Profile = sequelize.define(
  "Profile",
  {
    id: {
      type: Sequelize.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: 10,
    },
    first_name: {
      type: Sequelize.STRING,
    },
    last_name: {
      type: Sequelize.STRING,
    },
    bio: {
      type: Sequelize.STRING,
    },
    avatar: {
      type: Sequelize.STRING,
    },
    userId: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    createdAt: {
      type: Sequelize.DATE,
      allowNull: false,
    },
    updatedAt: {
      type: Sequelize.DATE,
      allowNull: false,
    },
  },
  {
    classMethods: {
      associate: function (models) {
        Profile.belongsTo(models.User, {
          as: "user",
          foreignKey: "userId",
          foreignKeyConstraint: true,
        });
      },
    },
  },
  {
    freezeTableName: true,
  }
);

module.exports = Profile;
