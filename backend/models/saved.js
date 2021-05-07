"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Saved extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.belongsTo(models.blogs,{
        as:"blogSaved",
        foreignKey:"blogId",
        foreignKeyConstraint:true,
      })
      this.belongsTo(models.Profile, {
        as: "profileSaved",
        foreignKey: "profileId",
        foreignKeyConstraint: true,
      });
    }
  }
  Saved.init(
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
      tableName: "saved",
      modelName: "Saved",
    }
  );
  return Saved;
};
