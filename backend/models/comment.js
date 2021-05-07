"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Comment extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.belongsTo(models.blogs,{
        as:"blogComment",
        foreignKey:"blogId",
        foreignKeyConstraint:true,
      })
      this.belongsTo(models.Profile, {
        as: "profileComment",
        foreignKey: "profileId",
        foreignKeyConstraint: true,
      });
    }
  }
  Comment.init(
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
      tableName: "comment",
      modelName: "Comment",
    }
  );
  return Comment;
};
