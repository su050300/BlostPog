var Sequelize = require("sequelize");
var sequelize = require("../routes/db.js");
var User = sequelize.define(
  "User",
  {
    id: {
      type: Sequelize.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: 10,
    },
    username: {
      type: Sequelize.STRING,
      allowNull: false,
      unique: true,
    },
    email: {
      type: Sequelize.STRING,
      allowNull: false,
      unique: true,
    },
    password: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    isVerified: {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: false,
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
        User.belongsTo(models.Profile, {
          as: "profile",
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

module.exports = User;
