const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const bcrypt = require('bcryptjs');
const session = require('express-session');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const User = require('./models/user');
require('dotenv').config();

const indexRouter = require('./routes/index');

const app = express();

const mongoDB = process.env.DB_URL;
// eslint-disable-next-line no-console
mongoose.connect(mongoDB, { useUnifiedTopology: true, useNewUrlParser: true }).then(() => console.log('connected to db'));

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(session({ secret: 'cats', resave: false, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());
app.use(express.urlencoded({ extended: false }));

passport.use(
  new LocalStrategy((username, password, done) => {
    User.findOne({ username }, (err, user) => {
      if (err) {
        return done(err);
      }
      if (!user) {
        return done(null, false, { msg: 'Incorrect username' });
      }
      bcrypt.compare(password, user.password, (err, res) => {
        if (res) {
          // passwords match! log user in
          return done(null, user);
        }
        // passwords do not match!
        return done(null, false, { msg: 'Incorrect password' });
      });
      return done(null, user);
    });
  }),
);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  User.findById(id, (err, user) => {
    done(err, user);
  });
});

app.use('/', indexRouter);

// eslint-disable-next-line no-console
app.listen(3000, () => console.log('app listening on port 3000!'));

module.exports = app;
