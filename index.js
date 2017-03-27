const express = require('express');
const app = express();
// TODO: logging
// const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
// sequelize
const models = require('./models');
// passport
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');
const flash = require('connect-flash');
const session = require('express-session');  
const RedisStore = require('connect-redis')(session);

const router = express.Router();

app.set('port', (process.env.PORT || 5000));

app.use(express.static(__dirname + '/public'));

// views is directory for all template files
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

app.use(cookieParser());
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.json());

app.use(session({  
  store: new RedisStore({
    url: process.env.REDIS_URL
  }),
  secret: process.env.REDIS_SECRET,
  resave: false,
  saveUninitialized: false
}));
app.use(passport.initialize());  
app.use(passport.session()) ;
app.use(flash());

// used to serialize the user for the session
passport.serializeUser((user, done) => {
  done(null, user.id);
});

// used to deserialize the user
passport.deserializeUser((id, done) => {
  models.User.findById(id).then(
    (user) => {
      done(null, user);
    }, 
    (err) => {
      done(null, user);
    }); 
});

passport.use('local-signup', new LocalStrategy({
  // by default, local strategy uses username and password, we will override with email
  usernameField : 'email',
  passwordField : 'password',
  passReqToCallback : true // allows us to pass back the entire request to the callback
},
(req, email, password, done) => {
  // asynchronous
  // User.findOne wont fire unless data is sent back
  process.nextTick(() => {
    models.User.findOne({where: {'email': email}})
      .then((user) => {
        // check to see if theres already a user with that email
        if (user) {
          return done(null, false, req.flash('signupMessage', 'That email is already taken.'));
        } else {

          // if there is no user with that email
          // create the user
          models.User.create({
            email: email,
            password: models.User.generateHash(password)
          }).then((newUser) => {
            newUser
              .save()
              .then(() => done(null, newUser),
                    (err) => { throw err; });
          });
        }

      }, 
      (err) => done(err));    

  });
}));



passport.use('local-login', new LocalStrategy({
  // by default, local strategy uses username and password, we will override with email
  usernameField : 'email',
  passwordField : 'password',
  passReqToCallback : true
},
(req, email, password, done) => {
  models.User.findOne({where: {'email':  email }})
    .then((user) => {
      if (!user || !user.validPassword(password)) {
        return done(null, false, req.flash('loginMessage', 'Bad login.'));
      }

      return done(null, user);
    }, 
    (err) => done(err));
}));

app.get('/', (request, response) => {
  response.render('pages/index');
});

app.get('/login', (req, res) => {
  res.render('pages/login', { message: req.flash('loginMessage') }); 
});

app.post('/login', passport.authenticate('local-login', {
  successRedirect : '/profile',
  failureRedirect : '/login',
  failureFlash : true
}));


app.get('/signup', (req, res) => {
  res.render('pages/signup', { message: req.flash('signupMessage') });
});

app.post('/signup', passport.authenticate('local-signup', {
  successRedirect : '/profile',
  failureRedirect : '/signup',
  failureFlash : true
}));

app.get('/profile', isLoggedIn, (req, res) => {
  res.render('pages/profile', {
    user : req.user
  });
});

app.get('/logout', (req, res) => {
  req.logout();
  res.redirect('/');
});

// route middleware to make sure a user is logged in
function isLoggedIn(req, res, next) {

  // if user is authenticated in the session, carry on 
  if (req.isAuthenticated()) {
    return next();
  }

  // if they aren't redirect them to the home page
  res.redirect('/');
}

models.sequelize
  .sync()
  .then(() => {
    app.listen(app.get('port'), 
    () => console.log('Node app is running on port', app.get('port')))
  });


