const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const models = require('../models');
const constants = require('../util/constants');

// Above the Fold
router.get('/', (req, res) => {
  console.log('main');
  console.log(models.Article);

  // models.Article.findOne().then(() => {
  //   res.send('Hello World!')
  // })

  models.Article.findAll({
    where: {
      'is_public': true
    },
    // order: 'publish_date DESC'
  })
    .then((articles) => {
      console.log('result');

      const featuredArticle = articles.shift();
      res.render('pages/abovethefold', {
        featuredArticle: featuredArticle,
        articles: articles,
        path: req.path
      });
    }, (err) => {
      res.status(500);
    })
    .finally(() => {
      models.sequelize.close();
    });;
});

router.get('/news', (req, res) => {
  models.Article.findAll({
    where: {
      'is_public': true,
      'content_type': constants.articleContentTypes.NEWS
    },
    order: 'publish_date DESC'
  })
    .then((articles) => {
      res.render('pages/news', {
        articles: articles,
        path: req.path
      });
    }, (err) => {
      res.status(500);
    });
});

router.get('/essays', (req, res) => {
  models.Article.findAll({
    where: {
      'is_public': true,
      'content_type': constants.articleContentTypes.ESSAY
    },
    order: 'publish_date DESC'
  })
    .then((articles) => {
      res.render('pages/essays', {
        articles: articles,
        path: req.path
      });
    }, (err) => {
      res.status(500);
    });
});

router.get('/sitemap', (req, res) => {
  res.render('pages/sitemap');
});

router.get('/about', (req, res) => {
  res.render('pages/about', {
    path: req.path
  });
});

module.exports = router;