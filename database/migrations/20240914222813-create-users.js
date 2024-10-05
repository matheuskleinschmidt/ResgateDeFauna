"use strict";


module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("users", {
            id: {
              type: Sequelize.UUID,
              defaultValue: Sequelize.UUIDV4,
              primaryKey: true,
            },
            name: {
              type: Sequelize.STRING(100),
              allowNull: false,
              validate: {
                notEmpty: true,
              },
            },
            email: {
              type: Sequelize.STRING,
              allowNull: false,
              unique: true,
              validate: {
                isEmail: true,
              },
            },
            password: {
              type: Sequelize.STRING,
              allowNull: false,
            },
            role: {
              type: Sequelize.ENUM('admin', 'user', 'guest'),
              defaultValue: 'user',
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
            lastLogin: {
              type: Sequelize.DATE,
              allowNull: true,
              comment: 'Data do último login do usuário',
            },
          });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable("users");
  },
};
