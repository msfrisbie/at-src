'use strict';
module.exports = function(sequelize, DataTypes) {
  var SiteConfig = sequelize.define('SiteConfig', {
    config_key: DataTypes.STRING,
    config_value: DataTypes.STRING
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
      }
    }
  });
  return SiteConfig;
};