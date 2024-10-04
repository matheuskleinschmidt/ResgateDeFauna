import { Model, DataTypes,Sequelize } from "sequelize";
import sequelize from "../../../db_connection.js";
import Rescues from "@/app/api/models/Rescues"

class ProcedureOrientationBys extends Model {}

ProcedureOrientationBys.init(
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
    modelName: "procedureOrientationBys",
    tableName: "procedureOrientationBys",
    timestamps: true,
  }
);

ProcedureOrientationBys.hasMany(Rescues);
Rescues.belongsTo(ProcedureOrientationBys)

export default ProcedureOrientationBys;
