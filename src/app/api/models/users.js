import { Model, DataTypes, Sequelize, ForeignKeyConstraintError } from "sequelize";
import sequelize from "../../../db_connection.js";
import Rescues from "@/app/api/models/Rescues";

class Users extends Model {}

Users.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
      },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    role: {
      type: DataTypes.ENUM("admin", "user", "guest"),
      defaultValue: "user",
    },
    createdAt: {
      type: Sequelize.DATE,
      allowNull: false,
      defaultValue: Sequelize.fn("NOW"),
    },
    updatedAt: {
      type: Sequelize.DATE,
      allowNull: false,
      defaultValue: Sequelize.fn("NOW"),
    },
    lastLogin: {
      type: DataTypes.DATE,
      allowNull: true,
      comment: "Data do último login do usuário",
    },
  },
  {
    sequelize,
    modelName: "users",
    tableName: "users",
    timestamps: true,
  }
);

Users.hasMany(Rescues);
Rescues.belongsTo(Users);

export default Users;
