'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('user', 'kakao_id', {
      type: Sequelize.STRING,
      allowNull: false,
      unique: true,
      comment: '카카오 고유 ID',
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('user', 'kakao_id');
  },
};
