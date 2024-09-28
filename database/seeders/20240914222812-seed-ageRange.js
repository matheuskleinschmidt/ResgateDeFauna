'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    return queryInterface.bulkInsert('ageRanges', [
      { name: 'Filhote', createdAt: new Date(), updatedAt: new Date() },
      { name: 'Adulto', createdAt: new Date(), updatedAt: new Date() },
      { name: 'Idoso', createdAt: new Date(), updatedAt: new Date() },
      { name: 'Outros', createdAt: new Date(), updatedAt: new Date() },
    ]);
  },

  async down (queryInterface, Sequelize) {
    return queryInterface.bulkDelete('ageRanges', null, {});
  }
};
