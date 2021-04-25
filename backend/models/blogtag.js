'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class BlogTag extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.belongsTo(models.Tag,{
        as:"tag",
        foreignKey:"tagId",
        foreignKeyConstraint:true,
      });
      this.belongsTo(models.blogs,{
        as:"blog",
        foreignKey:"blogId2",
        foreignKeyConstraint:true,
      });
    }
  };
  BlogTag.init({
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
    tableName:"blog_tags",
    modelName: 'BlogTag',
  });
  return BlogTag;
};