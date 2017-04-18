const express = require('express');
const router = express.Router();

router.get('/', (request, response) => {
  response.render('pages/index');
});

router.use(require('./auth'));

router.use('/articles', require('./article'));

module.exports = router;