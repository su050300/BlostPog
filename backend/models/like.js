"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Like extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    
    static associate(models) {
      this.belongsTo(models.blogs,{
        as:"blogLike",
        foreignKey:"blogId",
        foreignKeyConstraint:true,
      })
      this.belongsTo(models.Profile, {
        as: "profileLike",
        foreignKey: "profileId",
        foreignKeyConstraint: true,
      });
    }
  }
  Like.init(
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
      tableName: "likes",
      modelName: "Like",
    }
  );
  return Like;
};
