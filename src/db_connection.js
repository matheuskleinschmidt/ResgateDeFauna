import { Sequelize } from "sequelize";
import { options } from "../database/config/config.mjs";

const sequelize = new Sequelize(options) 

export default sequelize;