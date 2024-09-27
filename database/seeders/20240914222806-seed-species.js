"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.bulkInsert("species", [
      {
        scientificName: "Canis lupus",
        commonName: "Lobo",
        groupId: "1",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        scientificName: "Felis catus",
        commonName: "Gato",
        groupId: "1",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        scientificName: "Python regius",
        commonName: "Píton-real",
        groupId: "2",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        scientificName: "Chelonia mydas",
        commonName: "Tartaruga-verde",
        groupId: "2",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        scientificName: "Falco peregrinus",
        commonName: "Falcão-peregrino",
        groupId: "3",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        scientificName: "Ara macao",
        commonName: "Arara-vermelha",
        groupId: "3",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.bulkDelete("species", null, {});
  },
};
