const express = require('express');
const router = express.Router();

// Import all main paths
router.use(require('./main'));

// Import all auth paths
router.use(require('./auth'));

// Import all article paths
// Prepends '/articles'
router.use('/articles', require('./article'));

module.exports = router;