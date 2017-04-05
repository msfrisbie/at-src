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

const setupPassport = require('./middleware/passport');

const auth = require('./middleware/auth');

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

// app.use(require('./middleware/passport'));
setupPassport();

app.use(require('./controllers'));






models.sequelize
  .sync()
  .then(() => {
    app.listen(app.get('port'), 
    () => console.log('Node app is running on port', app.get('port')))
  });


