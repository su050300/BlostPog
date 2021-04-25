'use strict';
module.exports = {
  up: async (queryInterface, DataTypes) => {
    return queryInterface.createTable('blogcategories', {
      blogId: {
        type: DataTypes.INTEGER,
        allowNull:false,
      },
      categoryId: {
        type: DataTypes.INTEGER,
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
    return queryInterface.dropTable('blogcategories');
  }
};