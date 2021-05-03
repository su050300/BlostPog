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
        foreignKey:"blogId",
        foreignKeyConstraint:true,
      });
    }
  };
  BlogTag.init({
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
  }, {
    sequelize,
    tableName:"blogtag",
    modelName: 'BlogTag',
  });
  return BlogTag;
};