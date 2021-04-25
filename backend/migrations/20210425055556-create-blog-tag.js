'use strict';
module.exports = {
  up: async (queryInterface, DataTypes) => {
    return queryInterface.createTable('blogtags', {
      blogId: {
        type: DataTypes.INTEGER,
        allowNull:false,
      },
      tagId: {
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
    return queryInterface.dropTable('blogtags');
  }
};