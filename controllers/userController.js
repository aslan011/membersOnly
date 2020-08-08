/* eslint-disable no-underscore-dangle */
const { validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const Message = require('../models/message');
const User = require('../models/user');

exports.adminMode = (req, res) => {
  let result;
  Message.find({}, (err, docs) => {
    result = docs.map((doc) => ({
      title: doc.title,
      text: doc.text,
    }));
  })
    .then(() => res.render('admin', { messages: result }))
    .then(() => console.log(result));
};

exports.adminMode_POST = (req, res) => {
  let result;
  console.log(`this,${req.body}`);
  Message.deleteOne({ user: req.user._id })
    .then(() => Message.find({}, (err, docs) => {
      result = docs.map((doc) => ({
        title: doc.title,
        text: doc.text,
      }));
    }))
    .then(() => res.render('admin', { messages: result }));
};

exports.signup = (req, res) => {
  if (!req.user) {
    res.render('sign-up-form');
  } else { res.redirect('homepage'); }
};

exports.signup_POST = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.redirect('/');
    return;
  }

  bcrypt.hash(req.body.password, 10, (err, hash) => {
    new User({
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      username: req.body.username,
      password: hash,
      status: false,
    }).save((err) => {
      if (err) {
        return next(err);
      }
      return res.redirect('/login');
    });
  });
};

exports.login = (req, res) => {
  if (!req.user) {
    res.render('login');
  } else { res.redirect('/homepage'); }
};

exports.logout = (req, res) => {
  req.logout();
  res.redirect('/login');
};

exports.homepage = (req, res) => {
  let result = null;
  const { admin } = req.user;
  if (req.user && req.user.status) {
    Message.find({}, (err, docs) => {
      result = docs.map((doc) => ({
        title: doc.title,
        text: doc.text,
      }));
    }).then(() => { res.render('homepage', { messages: result, admin }); });
  } else if (req.user) {
    Message.find({ user: req.user._id }, (err, docs) => {
      result = docs.map((doc) => ({
        title: doc.title,
        text: doc.text,
      }));
    }).then(() => res.render('homepage', { messages: result, admin }));
  } else { res.redirect('/sign-up'); }
};

exports.secretCode = (req, res) => {
  if (req.body.code === 'myTopSecret') {
    User.findOne({ _id: req.user._id }).then((user) => user.updateOne({ status: true }))
      .then(() => res.redirect('/homepage'));
  }
};

exports.redirect = (req, res) => {
  res.redirect('/sign-up');
};
