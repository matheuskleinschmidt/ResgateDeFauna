import { Model, DataTypes, Sequelize } from "sequelize";
import sequelize from "../../../db_connection.js";
import Species from "@/app/api/models/Species.js";

class AnimalGroups extends Model {}

AnimalGroups.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
    },
    groupName: {
      type: DataTypes.STRING(50),
      allowNull: false,
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
  },
  {
    sequelize,
    modelName: "AnimalGroups",
    tableName: "animalGroups",
    timestamps: true,
  }
);

Species.belongsTo(AnimalGroups)

export default AnimalGroups;
