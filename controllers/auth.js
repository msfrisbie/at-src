const express = require('express');
const router = express.Router();
const passport = require('passport');
const auth = require('../middleware/auth');

router.get('/login', (req, res) => {
  res.render('pages/login', { message: req.flash('loginMessage') }); 
});

router.post('/login', passport.authenticate('local-login', {
  successRedirect : '/profile',
  failureRedirect : '/login',
  failureFlash : true
}));


router.get('/signup', (req, res) => {
  res.render('pages/signup', { message: req.flash('signupMessage') });
});

router.post('/signup', passport.authenticate('local-signup', {
  successRedirect : '/profile',
  failureRedirect : '/signup',
  failureFlash : true
}));

router.get('/logout', (req, res) => {
  req.logout();
  res.redirect('/');
});

router.get('/profile', auth.isLoggedIn, (req, res) => {
  res.render('pages/profile', {
    user : req.user
  });
});

module.exports = router;