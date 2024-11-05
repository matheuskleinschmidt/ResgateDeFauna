"use strict";

const { v4: uuidv4 } = require("uuid");
const bcrypt = require("bcrypt");

module.exports = {
  async up(queryInterface, Sequelize) {
    const hashedPassword = await bcrypt.hash("admin", 10);

    return queryInterface.bulkInsert(
      "users",
      [
        {
          id: uuidv4(),
          name: "Admin",
          email: "matheuseckel.dev@gmail.com",
          password: hashedPassword,
          role: "admin",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {}
    );
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.bulkDelete(
      "users",
      {
        email: "matheuseckel.dev@gmail.com",
      },
      {}
    );
  },
};
