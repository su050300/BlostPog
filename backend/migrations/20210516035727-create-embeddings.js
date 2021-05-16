'use strict';
module.exports = {
  up: async (queryInterface, DataTypes) => {
    await queryInterface.createTable('embeddings', {
      id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: 10,
      },
      blogId:{
        type:DataTypes.INTEGER,
        allowNull:false,
        unique:true,
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
    });
  },
  down: async (queryInterface, DataTypes) => {
    await queryInterface.dropTable('embeddings');
  }
};