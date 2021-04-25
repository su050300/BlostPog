'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Blogs extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(models.Profile, {
        as: "profile",
        foreignKey: "authorId",
        foreignKeyConstraint: true,
      });

      this.hasMany(models.BlogCategory,{
        as:"categories",
        foreignKey:"blogId1",
        foreignKeyConstraint:true,
      });

      this.hasMany(models.BlogTag,{
        as:"tags",
        foreignKey:"blogId2",
        foreignKeyConstraint:true,
      });
    }
  };
  Blogs.init({
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: 10,
    },
    content: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
    },
  }, {
    sequelize,
    tableName: 'blogs',
    modelName: 'blogs',
  });
  return Blogs;
};