const dotenv = require("dotenv");
dotenv.config({ path: "./config.env" });

const config = {
  host: "localhost",
  user: "root",
  password: "hellobts1234",
  database: "sakila",
};

module.exports = config;
