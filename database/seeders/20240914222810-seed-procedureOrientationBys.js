'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    return queryInterface.bulkInsert('procedureOrientationBys', [
      { name: 'Resgate', createdAt: new Date(), updatedAt: new Date() },
      { name: 'Telefone', createdAt: new Date(), updatedAt: new Date() },
      { name: 'Whatsapp', createdAt: new Date(), updatedAt: new Date() },
      { name: 'Facebook', createdAt: new Date(), updatedAt: new Date() },
      { name: 'Instagram', createdAt: new Date(), updatedAt: new Date() },
      { name: 'E-mail', createdAt: new Date(), updatedAt: new Date() },
      { name: 'Sistema Ouvidoria', createdAt: new Date(), updatedAt: new Date() },
      { name: 'Animal não localizado', createdAt: new Date(), updatedAt: new Date() },
      { name: 'Outros', createdAt: new Date(), updatedAt: new Date() },
    ]);
  },

  async down (queryInterface, Sequelize) {
    return queryInterface.bulkDelete('procedureOrientationBys', null, {});
  }
};
