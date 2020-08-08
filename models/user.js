const mongoose = require('mongoose');

const { Schema } = mongoose;

const User = mongoose.model(
  'User',
  new Schema(
    {
      firstName: { type: String },
      lastName: { type: String },
      username: { type: String },
      password: { type: String },
      status: { type: Boolean },
      admin: { type: Boolean },
    },
  ),
);

module.exports = User;
