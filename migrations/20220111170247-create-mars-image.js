'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('MarsImages', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      url: {
        type: Sequelize.STRING
      },
      sol: {
        type: Sequelize.INTEGER
      },
      earth_date: {
        type: Sequelize.STRING
      },
      email: {
        type: Sequelize.STRING
      },
      camera: {
        type: Sequelize.STRING
      },
      id_img: {
        type: Sequelize.INTEGER
      },
      mission: {
        type: Sequelize.STRING
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('MarsImages');
  }
};