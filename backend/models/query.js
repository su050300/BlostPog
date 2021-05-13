"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Query extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.belongsTo(models.blogs, {
        as: "blogQuery",
        foreignKey: "blogId",
        foreignKeyConstraint: true,
      });
      this.belongsTo(models.Profile, {
        as: "profileQuery",
        foreignKey: "profileId",
        foreignKeyConstraint: true,
      });
    }
  }
  Query.init(
    {
      id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: 10,
      },
      comment: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      sender:{
        type:DataTypes.STRING,
        allowNull:false,
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
      tableName: "query",
      modelName: "Query",
    }
  );
  return Query;
};
