const mongoose = require('mongoose');

const { Schema } = mongoose;

const Message = mongoose.model(
  'Message',
  new Schema(
    {
      title: { type: String },
      text: { type: String },
      user: { type: String },
    },
    {
      timestamps: true,
    },
  ),
);

// Export model
module.exports = Message;
