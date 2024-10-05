'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    return queryInterface.bulkInsert('status', [
      { name: 'Aberto', createdAt: new Date(), updatedAt: new Date() },
      { name: 'Em andamento', createdAt: new Date(), updatedAt: new Date() },
      { name: 'Fechado', createdAt: new Date(), updatedAt: new Date() },
      { name: 'Outro', createdAt: new Date(), updatedAt: new Date() },
    ]);
  },

  async down (queryInterface, Sequelize) {
    return queryInterface.bulkDelete('status', null, {});
  }
};
