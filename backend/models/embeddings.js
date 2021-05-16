'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Embeddings extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.belongsTo(models.blogs, {
        as: "embedd",
        foreignKey: "blogId",
        foreignKeyConstraint: true,
      });
    }
  };
  Embeddings.init({
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: 10,
    },
    embedding:{
      type:DataTypes.TEXT,
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
  }, {
    sequelize,
    tableName: "embeddings",
    modelName: 'Embeddings',
  });
  return Embeddings;
};