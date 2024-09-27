'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    return queryInterface.bulkInsert('animalGroups', [
      { groupName: 'Mamifero', createdAt: new Date(), updatedAt: new Date() },
      { groupName: 'Répteis', createdAt: new Date(), updatedAt: new Date() },
      { groupName: 'Aves', createdAt: new Date(), updatedAt: new Date() },
      { groupName: 'Peixes', createdAt: new Date(), updatedAt: new Date() },
      { groupName: 'Anfibios', createdAt: new Date(), updatedAt: new Date() },
      { groupName: 'Outros', createdAt: new Date(), updatedAt: new Date() },
    ]);
  },

  async down (queryInterface, Sequelize) {
    return queryInterface.bulkDelete('animalGroups', null, {});
  }
};
