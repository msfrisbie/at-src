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
    url_snippet: {
      type: DataTypes.STRING,
      unique: true
    },
    image_url: DataTypes.STRING,
    publish_date: {
      type: DataTypes.DATE,
      defaultValue: new Date
    },
    body: DataTypes.TEXT,
    is_public: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    content_type: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    popularity: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    }
  });

  // Class Methods

  Article.associate = function (models) {
    // associations can be defined here
    Article.belongsTo(models.User);
  };

  Article.getOrmObjectFromRequestBody = function (body) {
    return {
      title: body.article_title,
      url_snippet: body.article_url_snippet,
      image_url: body.article_image_url,
      publish_date: body.article_publish_date,
      body: body.article_body,
      is_public: body.article_is_public === 'on',
      content_type: body.article_content_type,
      popularity: body.article_popularity
    };
  };

  Article.normalizeDigits = function (number, numDigits = 2) {
    let numberString = `${number}`;
    while (numberString.length < numDigits) {
      numberString = `0${numberString}`;
    }
    return numberString;
  };

  Article.getHtmlFormCompatibleDate = function (date) {
    const month = Article.normalizeDigits(date.getMonth() + 1);
    const day = Article.normalizeDigits(date.getDate());
    return `${date.getFullYear()}-${month}-${day}`
  };

  Article.getFullReadableDate = function (date) {
    const month = date.getMonth();
    const day = date.getDate();
    return `${monthNames[month]} ${day}, ${date.getFullYear()}`;
  };

  // Instance Methods

  Article.prototype.getUrl = function () {
    return `/articles/${this.url_snippet}`;
  };

  Article.prototype.getTaglessBody = function () {
    // This was breaking the create view, since body did not exist
    return this.body.replace(/<.?[a-zA-Z]+>/g, '');
  };

  Article.prototype.getTimezoneCorrectedPublishDate = function () {
    return new Date(this.publish_date.getTime() +
      this.publish_date.getTimezoneOffset() * 60000);
  };

  Article.prototype.htmlFormCompatiblePublishDate = function () {
    return Article.getHtmlFormCompatibleDate(this.getTimezoneCorrectedPublishDate());
  };

  Article.prototype.readablePublishDate = function () {
    return Article.getFullReadableDate(this.getTimezoneCorrectedPublishDate());
  }

  return Article;
};