'use strict';

const bcrypt = require('bcrypt');

module.exports = function(sequelize, DataTypes) {
  const User = sequelize.define('User', {
    username: DataTypes.STRING,
    email: DataTypes.STRING,
    firstname: DataTypes.STRING,
    lastname: DataTypes.STRING,
    password: DataTypes.STRING,
    salt: DataTypes.STRING
  }, {
    classMethods: {
      associate(models) {
        // associations can be defined here
      },
      generateHash(password) {
        return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
      }
    },
    instanceMethods: {
      validPassword(password) {
        return bcrypt.compareSync(password, this.password);
      }
    }
  });
  return User;
};

// var Foo = sequelize.define('Foo', { /* attributes */}, {
//   classMethods: {
//     method1: function(){ return 'smth' }
//   },
//   instanceMethods: {
//     method2: function() { return 'foo' }
//   }
// })

// // Example:
// Foo.method1()
// Foo.build().method2()