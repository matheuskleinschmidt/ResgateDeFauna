import { Model, DataTypes, Sequelize } from 'sequelize';
import sequelize from "../../../db_connection.js";
import Rescues from "@/app/api/models/Rescues"

class Species extends Model {}

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
    modelName: 'species',
    tableName: 'species',
    timestamps: true
  });

Species.hasMany(Rescues);
Rescues.belongsTo(Species)

export default Species