"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Follower extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.belongsTo(models.Profile, {
        as: "follower",
        foreignKey: "followerId",
        foreignKeyConstraint: true,
      });
      this.belongsTo(models.Profile, {
        as: "following",
        foreignKey: "followingId",
        foreignKeyConstraint: true,
      });
    }
  }
  Follower.init(
    {
      id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: 10,
      },
      createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      updatedAt: {
        type: DataTypes.DATE,
        allowNull: false,
      },
    },
    {
      sequelize,
      tableName: "follower",
      modelName: "Follower",
    }
  );
  return Follower;
};
