'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    return queryInterface.bulkInsert('situations', [
      { name: 'Atropelamento', createdAt: new Date(), updatedAt: new Date() },
      { name: 'Caça', createdAt: new Date(), updatedAt: new Date() },
      { name: 'Ataque por Pets', createdAt: new Date(), updatedAt: new Date() },
      { name: 'Vidraça', createdAt: new Date(), updatedAt: new Date() },
      { name: 'Cativeiro', createdAt: new Date(), updatedAt: new Date() },
      { name: 'Outros', createdAt: new Date(), updatedAt: new Date() },
    ]);
  },

  async down (queryInterface, Sequelize) {
    return queryInterface.bulkDelete('situations', null, {});
  }
};
