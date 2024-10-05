"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("rescues", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      speciesId: {
        type: Sequelize.INTEGER,
        references: {
          model: "species",
          key: "id",
        },
        allowNull: false,
      },
      fullDate: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      weight: {
        type: Sequelize.FLOAT,
        allowNull: true,
      },
      measurement: {
        type: Sequelize.JSONB,
        allowNull: true,
      },
      occurrence: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      calledById: {
        type: Sequelize.INTEGER,
        references: {
          model: "calledBys",
          key: "id",
        },
        allowNull: true,
      },
      procedureOrientationById: {
        type: Sequelize.INTEGER,
        references: {
          model: "procedureOrientationBys",
          key: "id",
        },
        allowNull: true,
      },
      age: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      situationId: {
        type: Sequelize.INTEGER,
        references: {
          model: "situations",
          key: "id",
        },
        allowNull: true,
      },
      ageRangeId: {
        type: Sequelize.INTEGER,
        references: {
          model: "ageRanges",
          key: "id",
        },
        allowNull: true,
      },
      postRescueId: {
        type: Sequelize.INTEGER,
        references: {
          model: "postRescues",
          key: "id",
        },
        allowNull: true,
      },
      observation: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      address: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      locationCoordinates: {
        type: Sequelize.JSONB,
        allowNull: true,
      },
      releaseLocationCoordinates: {
        type: Sequelize.JSONB,
        allowNull: true,
      },
      statusId: {
        type: Sequelize.INTEGER,
        references: {
          model: "status",
          key: "id",
        },
        allowNull: true,
      },
      userId:{
        type: Sequelize.UUID,
        references: {
          model: "users",
          key: "id",
        },
        allowNull: true,
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.fn("NOW"),
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.fn("NOW"),
      },
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable("rescues");
  },
};
