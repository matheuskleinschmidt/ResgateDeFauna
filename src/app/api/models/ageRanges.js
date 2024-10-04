import { Model, DataTypes, Sequelize } from "sequelize";
import sequelize from "@/db_connection";
import Rescues from "@/app/api/models/Rescues"


class AgeRanges extends Model {}

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
    modelName: "ageRanges",
    tableName: "ageRanges",
    timestamps: true,
  }
);

AgeRanges.hasMany(Rescues);
Rescues.belongsTo(AgeRanges);

export default AgeRanges;
