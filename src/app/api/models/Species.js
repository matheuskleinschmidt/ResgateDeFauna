import { Model, DataTypes, Sequelize } from 'sequelize';
import sequelize from "../../../db_connection.js";

class Species extends Model {
  static associate(models) {
    this.belongsTo(models.AnimalGroups, {  
      foreignKey: 'groupId',
      as: 'animalGroup',  
    });
  }
}

Species.init({
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false
    },
    scientificName: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    commonName: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    groupId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'AnimalGroups',
        key: 'id'
      }
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: Sequelize.fn("NOW"),
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: Sequelize.fn("NOW"),
    },
  }, {
    sequelize,
    modelName: 'Species',
    tableName: 'species',
    timestamps: true
  });

export default Species