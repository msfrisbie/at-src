const express = require('express');
const router = express.Router();
const models = require('../models');
const auth = require('../middleware/auth');

// models.Article.findOne({where: {'email': email

// res.redirect('/');

// Show all articles
router.get('/', (req, res) => {
  models.Article.findAll()
    .then((articles) => {
      res.render('pages/articles/show_all', {
        articles: articles,
        user: req.user
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

// Edit an existing article
router.get('/:articleId/edit', auth.isLoggedIn, (req, res) => {
  models.Article.findByPk(req.params.articleId)
    .then((article) => {
      res.render('pages/articles/edit', {
        article: article
      });
    }, (err) => {
      res.status(404);
    });
});

// Show single article
router.get('/:articleId', (req, res) => {
  let articlePromise;

  if (isNaN(parseInt(req.params.articleId))) {
    // articleId is a url_snippet
    articlePromise = models.Article.findOne({
      where: {
        'url_snippet': req.params.articleId
      }
    });
  } else {
    // articleId is an integer
    articlePromise = models.Article.findByPk(req.params.articleId);
  }

  articlePromise.then((article) => {
    console.log(article);

    // If this is returning null, there is probably a bad image URL
    // hitting the site.
    models.Article.findAll({
      where: {
        'is_public': true,
        'id': {
          [sequelize.Op.not]: [article.id]
        }
      },
      order: sequelize.random(),
      // order: 'publish_date DESC',
      // [
      //   Sequelize.fn( 'RAND' ),
      // ],
      limit: 5
    })
      .then((otherArticles) => {
        res.render('pages/articles/show_one', {
          article: article,
          otherArticles: otherArticles,
          user: req.user
        });
      }, (err) => {
        res.status(404);
      });
  }, (err) => {
    res.status(404);
  });
});

// Create article
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
  models.Article.findByPk(req.params.articleId).then((article) => {
    // modify
    article.update(
      models.Article.getOrmObjectFromRequestBody(req.body))
      .then(() => {
        res.redirect(`/articles/${article.id}`);
        // res.render('pages/articles/show_one', {
        //   article: article,
        //   user: req.user
        // });
      }, (err) => {
        res.status(500).send({ error: err });
      });
  }, (err) => {
    res.status(500).send({ error: err });
  });

});

module.exports = router;