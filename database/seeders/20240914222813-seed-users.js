"use strict";

const { v4: uuidv4 } = require('uuid');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.bulkInsert("users", [
      {
        id: uuidv4(),
        name: "Admin",
        email: "matheuseckel.dev@gmail.com",
        password: "admin",  
        role: "admin",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.bulkDelete("users", {
      email: "matheuseckel.dev@gmail.com",  
    }, {});
  },
};
