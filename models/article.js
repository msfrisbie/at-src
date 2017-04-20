'use strict';

// const models = require('../models');

// http://stackoverflow.com/questions/27835801
// sequelize model:create 
//  --name Article 
//  --attributes title:string,publish_date:date,body:text

module.exports = (sequelize, DataTypes) => {

  const monthNames = ["January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const Article = sequelize.define('Article', {
    title: DataTypes.STRING,
    url_snippet: DataTypes.STRING,
    image_url: DataTypes.STRING,
    publish_date: {
      type: DataTypes.DATE,
      defaultValue: new Date
    },
    body: DataTypes.TEXT
  }, {
    classMethods: {
      associate(models) {
        // associations can be defined here
        Article.belongsTo(models.User);
      },
      getOrmObjectFromRequestBody(body) {
        return {
          title:        body.article_title,
          url_snippet:  body.article_url_snippet,
          image_url:    body.article_image_url,
          publish_date: body.article_publish_date,
          body:         body.article_body
        };
      },
      normalizeDigits(number, numDigits=2) {
        let numberString = `${number}`;
        while (numberString.length < numDigits) {
          numberString = `0${numberString}`;
        }
        return numberString;
      },
      getHtmlFormCompatibleDate(date) {
        const month = Article.normalizeDigits(date.getMonth() + 1);
        const day = Article.normalizeDigits(date.getDate());
        return `${date.getFullYear()}-${month}-${day}`
      },
      getFullReadableDate(date) {
        const month = date.getMonth();
        const day = date.getDate();
        return `${monthNames[month]} ${day}, ${date.getFullYear()}`;
      }
    }, instanceMethods: {
      htmlFormCompatiblePublishDate() {
        return Article.getHtmlFormCompatibleDate(this.publish_date);
      },
      readablePublishDate() {
        return Article.getFullReadableDate(this.publish_date);
      }
    }
  });

  return Article;
};