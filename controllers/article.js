const express = require('express');
const router = express.Router();
const models = require('../models');
const auth = require('../middleware/auth');

// models.Article.findOne({where: {'email': email

// res.redirect('/');

// Show all articles
router.get('/', (req, res) => {
  console.log('jake');

  models.Article.findAll()
  .then((articles) => {
    res.render('pages/articles/show_all', {
      articles: articles
    });
  }, (err) => {
    res.status(404);
  });
});

// Show page for creating a new article
router.get('/create', auth.isLoggedIn, (req, res) => {
  res.render('pages/articles/create', {
    article: models.Article.build({})
  });
});

router.get('/:articleId/edit', auth.isLoggedIn, (req, res) => {
  models.Article.findById(req.params.articleId)
  .then((article) => {
    console.log(JSON.stringify(article.publish_date))
    res.render('pages/articles/edit', {
      article: article
    });
  }, (err) => {
    res.status(404);
  });
});

// Show single article
router.get('/:articleId', (req, res) => {
  models.Article.findById(req.params.articleId).then((article) => {
    res.render('pages/articles/show_one', {
      article: article
    });  
  }, (err) => {
    res.status(404);
  });
});

// Create
router.post('/', auth.isLoggedIn, (req, res) => {
  models.Article.create(
    models.Article.getOrmObjectFromRequestBody(req.body))
  .then((newArticle) => {
    res.redirect(`/articles/${newArticle.id}`);
  }, (err) => {
    res.status(500).send({ error: err });
  });
});

// res.json({ products: [] });

// Modify existing article
router.post('/:articleId', auth.isLoggedIn, (req, res) => {
  models.Article.findById(req.params.articleId).then((article) => {
    // modify
    article.update(
      models.Article.getOrmObjectFromRequestBody(req.body))
    .then(() => {
      res.render('pages/articles/show_one', {
        article: article
      });
    }, (err) => {
      res.status(500).send({ error: err });
    });    
  }, (err) => {
    res.status(500).send({ error: err });
  });

});

module.exports = router;