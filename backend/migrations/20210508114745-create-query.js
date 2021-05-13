'use strict';
module.exports = {
  up: async (queryInterface, DataTypes) => {
    await queryInterface.createTable('query', {
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
      blogId:{
        type:DataTypes.INTEGER,
        allowNull:false,
      },
      profileId:{
        type:DataTypes.INTEGER,
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
    await queryInterface.dropTable('query');
  }
};