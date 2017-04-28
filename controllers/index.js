const express = require('express');
const router = express.Router();

router.get('/', (request, response) => {
  response.render('pages/index');
});

// Import all auth paths
router.use(require('./auth'));

// Import all article paths
// Prepends '/articles'
router.use('/articles', require('./article'));

module.exports = router;