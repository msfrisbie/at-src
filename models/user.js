'use strict';

const bcrypt = require('bcrypt');

module.exports = function (sequelize, DataTypes) {
  const User = sequelize.define('User', {
    username: DataTypes.STRING,
    email: DataTypes.STRING,
    firstname: DataTypes.STRING,
    lastname: DataTypes.STRING,
    password: DataTypes.STRING,
    salt: DataTypes.STRING
  });

  // ClassMethods
  User.associate = function (models) {
    // associations can be defined here
  };

  User.generateHash = function (password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
  };

  // Instance Methods
  User.prototype.validPassword = function (password) {
    return bcrypt.compareSync(password, this.password);
  };

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