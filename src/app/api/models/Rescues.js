import { Model, DataTypes, Sequelize } from "sequelize";
import sequelize from "../../../db_connection.js";

class Rescues extends Model {}

Rescues.init(
  {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER,
    },
    speciesId: {
      type: DataTypes.INTEGER,
      references: {
        model: "Species",
        key: "id",
      },
      allowNull: false,
    },
    fullDate: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    weight: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
    measurement: {
      type: DataTypes.JSONB,
      allowNull: true,
    },
    occurrence: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    calledById: {
      type: DataTypes.INTEGER,
      references: {
        model: "CalledBys",
        key: "id",
      },
      allowNull: true,
    },
    procedureOrientationById: {
      type: DataTypes.INTEGER,
      references: {
        model: "ProcedureOrientationBys",
        key: "id",
      },
      allowNull: true,
    },
    age: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    situationId: {
      type: DataTypes.INTEGER,
      references: {
        model: "Situations",
        key: "id",
      },
      allowNull: true,
    },
    ageRangeId: {
      type: Sequelize.INTEGER,
      references: {
        model: "ageRanges",
        key: "id",
      },
      allowNull: true,
    },
    postRescueId: {
      type: DataTypes.INTEGER,
      references: {
        model: "PostRescues",
        key: "id",
      },
      allowNull: true,
    },
    observation: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    address: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    locationCoordinates: {
      type: DataTypes.JSONB,
      allowNull: true,
    },
    releaseLocationCoordinates: {
      type: DataTypes.JSONB,
      allowNull: true,
    },
    statusId: {
      type: DataTypes.INTEGER,
      references: {
        model: "status",
        key: "id",
      },
      allowNull: true,
    },
    userId:{
      type: Sequelize.UUID,
      references: {
        model: "users",
        key: "id",
      },
      allowNull: true,
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
    modelName: "rescues",
    tableName: "rescues",
    timestamps: true,
  }
);

export default Rescues;
