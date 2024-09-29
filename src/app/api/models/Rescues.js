import { Model, DataTypes, Sequelize } from "sequelize";
import sequelize from "../../../db_connection.js";

class Rescues extends Model {
  static associate(models) {
    this.belongsTo(models.Species, {
      foreignKey: 'animalTypeId',
      as: 'species',
    });

    this.belongsTo(models.CalledBys, {
      foreignKey: 'calledById',
      as: 'calledBy',
    });

    this.belongsTo(models.ProcedureOrientationBys, {
      foreignKey: 'procedureOrientationById',
      as: 'procedureOrientationBy',
    });

    this.belongsTo(models.Situations, {
      foreignKey: 'situationId',
      as: 'situation',
    });

    this.belongsTo(models.PostRescues, {
      foreignKey: 'postRescueId',
      as: 'postRescue',
    });

    this.belongsTo(models.RescueStatus, {
      foreignKey: 'statusRescueId',
      as: 'statusRescue',
    });
  }
}

Rescues.init(
  {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER,
    },
    animalTypeId: {
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
    statusRescueId: {
      type: DataTypes.INTEGER,
      references: {
        model: "RescueStatus",
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
    modelName: "Rescues",
    tableName: "rescues",
    timestamps: true,
  }
);

export default Rescues;
