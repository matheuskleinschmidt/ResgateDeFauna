import { Model, DataTypes, Sequelize } from "sequelize";
import sequelize from "../../../db_connection.js";


class AgeRanges extends Model {
  static associate(models) {
    models.Rescues.belongsTo(this, {
      foreignKey: "ageRangeId",
      as: "ageRange",
    });
  }
}

AgeRanges.init(
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
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
    modelName: "AgeRanges",
    tableName: "ageRanges",
    timestamps: true,
  }
);

export default AgeRanges;
