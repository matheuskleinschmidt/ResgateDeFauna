import { Model, DataTypes, Sequelize } from "sequelize";
import sequelize from "../../../db_connection.js";
import Rescues from "@/app/api/models/Rescues"

class Status extends Model {}

Status.init(
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
    modelName: "status",
    tableName: "status",
    timestamps: true,
  }
);

Status.hasMany(Rescues);
Rescues.belongsTo(Status);

export default Status;