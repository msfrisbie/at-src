const express = require('express');
const router = express.Router();
const passport = require('passport');
const auth = require('../middleware/auth');

router.get('/sitemap', (req, res) => {
  res.render('pages/sitemap');
});

router.get('/sitemap', (req, res) => {
  res.render('pages/sitemap');
});

module.exports = router;