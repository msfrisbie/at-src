'use strict';

// http://stackoverflow.com/questions/27835801
// sequelize model:create 
//  --name Article 
//  --attributes title:string,publish_date:date,body:text

module.exports = function(sequelize, DataTypes) {
  var Article = sequelize.define('Article', {
    title: DataTypes.STRING,
    url_snippet: DataTypes.STRING,
    image_url: DataTypes.STRING,
    publish_date: DataTypes.DATE,
    body: DataTypes.TEXT
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
      }
    }
  });
  return Article;
};