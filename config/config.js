/*
https://github.com/sequelize/cli/issues/91
https://github.com/sequelize/cli/issues/77#issuecomment-68299495

sequelize migration:create

sequelize db:migrate

sequelize -c my_config.js
*/

require('dotenv').config();

module.exports = {
  development: {
    username: process.env.POSTGRES_USERNAME,
    password: process.env.POSTGRES_PASSWORD,
    database: process.env.POSTGRES_DATABASE,
    host: process.env.POSTGRES_HOST,
    dialect: process.env.POSTGRES_DIALECT
  },
  production: {
    username: process.env.POSTGRES_USERNAME,
    password: process.env.POSTGRES_PASSWORD,
    database: process.env.POSTGRES_DATABASE,
    host: process.env.POSTGRES_HOST,
    dialect: process.env.POSTGRES_DIALECT
  }
}