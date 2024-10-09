const pg = require('pg');

const options = {
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  dialect: "postgres",
  dialectModule: pg,
  "dialectOptions": {
    "ssl": {
      "require": true,
      "rejectUnauthorized": false
    }
  },
  logging: process.env.NODE_ENV === "development" ? console.log : false,
  migrationStorageTableName: "migrations",
};
//
if (process.env.NODE_ENV === "production") {
  options.dialectOptions = {
    ssl: {
      require: true,
      rejectUnauthorized: true,
    },
  };
}

module.exports = {
  development: options,
  test: options,
  production: options,
};
