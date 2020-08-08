const Message = require('../models/message');

exports.newMessage_POST = (req, res, next) => {
  new Message({
    title: req.body.messageTitle,
    text: req.body.messageText,
    // eslint-disable-next-line no-underscore-dangle
    user: req.user._id,
  }).save((err) => {
    if (err) {
      return next(err);
    }
    res.redirect('/homepage');
  });
};
