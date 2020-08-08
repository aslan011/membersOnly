const express = require('express');

const router = express.Router();
const { body } = require('express-validator');
const passport = require('passport');
const userController = require('../controllers/userController');
const messageController = require('../controllers/messageController');

router.get('/adminMode', userController.adminMode);

router.post('/adminMode', userController.adminMode_POST);

router.get('/sign-up', userController.signup);

router.get('/homepage', userController.homepage);

router.post('/secretCode', userController.secretCode);

router.get('/login', userController.login);

router.get('/logout', userController.logout);

router.post('/sign-up', [
  body('username', 'Enter longer username').trim().isLength({ min: 5 }),
  body('username').escape(),
  body('passwordConfirmation', 'passwordConfirmation field must have the same value as the password field')
    .exists()
    .custom((value, { req }) => value === req.body.password),
], userController.signup_POST);

router.post(
  '/login',
  passport.authenticate('local', {
    successRedirect: '/homepage',
    failureRedirect: '/sign-up',
  }),
);

router.post('/homepage', messageController.newMessage_POST);

router.get('/', userController.redirect);

module.exports = router;
