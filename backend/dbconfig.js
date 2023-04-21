const dotenv = require("dotenv");
dotenv.config({ path: "./config.env" });

const config = {
  host: process.env.DATABASE_SERVER,
  user: process.env.DATABASE_INSTANCENAME,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,
  multipleStatements: true,
};

module.exports = config;
