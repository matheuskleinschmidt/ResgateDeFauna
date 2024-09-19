/* eslint-disable import/no-anonymous-default-export */
export const options = {
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  dialect: "postgres",
  Logging:  console.log,
  migrationStorageTableName: "migrations",
};

if (process.env.NODE_ENV === "production") {
  options.dialectOptions = {
    ssl: {
      rejectUnauthorized: true,
    },
  };
}

export default {
  development: options,
  test: options,
  production: options,
};
