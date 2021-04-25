'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class BlogCategory extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.belongsTo(models.Category,{
        as:"category",
        foreignKey:"categoryId",
        foreignKeyConstraint:true,
      });
      this.belongsTo(models.blogs,{
        as:"blog",
        foreignKey:"blogId1",
        foreignKeyConstraint:true,
      });
    }
  };
  BlogCategory.init({
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
    tableName:"blog_categories",
    modelName: 'BlogCategory',
  });
  return BlogCategory;
};