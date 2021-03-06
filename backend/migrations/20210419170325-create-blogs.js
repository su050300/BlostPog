'use strict';
module.exports = {
  up: async (queryInterface, DataTypes) => {
    return queryInterface.createTable('blogs', {
      id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: 10,
      },
      title:{
        type:DataTypes.STRING,
        allowNull:false,
      },
      slug:{
        type:DataTypes.STRING,
        allowNull:false,
      },
      status: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      authorId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      content: {
        type: DataTypes.TEXT,
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
    });
  },
  down: async (queryInterface, Sequelize) => {
    return queryInterface.dropTable('blogs');
  }
};