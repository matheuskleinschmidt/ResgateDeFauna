import { Sequelize } from "sequelize";
import { options } from "../database/config/config.mjs";
import pg from 'pg';

const sequelize = new Sequelize({ ...options, dialectModule: pg }) 

export default sequelize;