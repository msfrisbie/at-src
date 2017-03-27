'use strict';

const fs        = require('fs');
const path      = require('path');
const Sequelize = require('sequelize');
const basename  = path.basename(module.filename);
const db        = {};

// const sequelize = new Sequelize(
//   process.env.POSTGRES_DATABASE, 
//   process.env.POSTGRES_USERNAME, 
//   process.env.POSTGRES_PASSWORD,
//   {
//     "host": process.env.POSTGRES_HOST,
//     "dialect": process.env.POSTGRES_DIALECT
//   });

const sequelize = new Sequelize(process.env.DATABASE_URL);

sequelize.authenticate();

fs
  .readdirSync(__dirname)
  .filter((file) => {
    return (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js');
  })
  .forEach((file) => {
    const model = sequelize['import'](path.join(__dirname, file));
    db[model.name] = model;
  });

Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
