"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.bulkInsert("species", [
      {
        scientificName: "Canis lupus",
        commonName: "Lobo",
        AnimalGroupId: "1",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        scientificName: "Felis catus",
        commonName: "Gato",
        AnimalGroupId: "1",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        scientificName: "Python regius",
        commonName: "Píton-real",
        AnimalGroupId: "2",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        scientificName: "Chelonia mydas",
        commonName: "Tartaruga-verde",
        AnimalGroupId: "2",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        scientificName: "Falco peregrinus",
        commonName: "Falcão-peregrino",
        AnimalGroupId: "3",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        scientificName: "Ara macao",
        commonName: "Arara-vermelha",
        AnimalGroupId: "3",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.bulkDelete("species", null, {});
  },
};
