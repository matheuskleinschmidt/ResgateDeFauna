import { Model, DataTypes, Sequelize } from "sequelize";
import sequelize from "../../../db_connection.js";
import Rescues from "@/app/api/models/Rescues"

class RescueStatus extends Model {}

RescueStatus.init(
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
    modelName: "rescueStatus",
    tableName: "rescueStatus",
    timestamps: true,
  }
);

RescueStatus.hasMany(Rescues);
//corrigir para que não precise
Rescues.belongsTo(RescueStatus,{foreignKey:'statusRescueId'});

export default RescueStatus;
