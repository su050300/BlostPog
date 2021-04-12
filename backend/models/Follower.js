var Sequelize = require("sequelize");
var sequelize = require("../routes/db.js");
var Follower = sequelize.define(
  "Follower",
  {
    followerId: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    followingId: {
      type: Sequelize.INTEGER,
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
        Profile.belongsTo(models.Profile, {
          as: "follower",
          foreignKey: "followerId",
          foreignKeyConstraint: true,
        });
      },
      associate: function (models) {
        Profile.belongsTo(models.Profile, {
          as: "following",
          foreignKey: "followingId",
          foreignKeyConstraint: true,
        });
      },
    },
  },
  {
    freezeTableName: true,
  }
);

module.exports = Follower;
