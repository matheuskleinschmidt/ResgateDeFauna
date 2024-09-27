import { Model, DataTypes, Sequelize } from "sequelize";
import sequelize from "../../../db_connection.js";

class PostRescues extends Model {
  static associate(models) {
    this.belongsTo(models.Rescues, {
      foreignKey: "postRescueId",
      as: "rescues",
    });
  }
}

PostRescues.init(
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
    modelName: "postRescues",
    tableName: "postRescues",
    timestamps: true,
  }
);

export default PostRescues;
