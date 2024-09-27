'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    return queryInterface.bulkInsert('postRescues', [
      { name: 'Soltura imediata', createdAt: new Date(), updatedAt: new Date() },
      { name: 'Veterinário + soltura/internação', createdAt: new Date(), updatedAt: new Date() },
      { name: 'Veterinário + soltura sem internação', createdAt: new Date(), updatedAt: new Date() },
      { name: 'Cetas', createdAt: new Date(), updatedAt: new Date() },
      { name: 'Obito', createdAt: new Date(), updatedAt: new Date() },
      { name: 'Butanta', createdAt: new Date(), updatedAt: new Date() },
      { name: 'Outros', createdAt: new Date(), updatedAt: new Date() },
    ]);
  },

  async down (queryInterface, Sequelize) {
    return queryInterface.bulkDelete('postRescues', null, {});
  }
};
