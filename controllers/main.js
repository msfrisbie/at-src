const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const models = require('../models');

router.get('/', (req, res) => {
  models.Article.findAll({
    where: {'is_public': true},
    order: 'publish_date DESC'
  })
  .then((articles) => {
    res.render('pages/abovethefold', {
      articles: articles
    });
  }, (err) => {
    res.status(500);
  });
});

router.get('/sitemap', (req, res) => {
  res.render('pages/sitemap');
});

router.get('/about', (req, res) => {
  res.render('pages/about');
});

module.exports = router;