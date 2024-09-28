import { Model, DataTypes, Sequelize } from "sequelize";
import sequelize from "../../../db_connection.js";

class AnimalGroups extends Model {
  static associate(models) {
    this.hasMany(models.Species, {
      foreignKey: "groupId",
      as: "species",
    });
  }
}

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

export default AnimalGroups;
