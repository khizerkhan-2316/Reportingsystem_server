const { Schema, model } = require('mongoose');
const UserSchema = new Schema(
  {
    id: {
      type: Number,
      required: false,
    },

    dealerId: {
      type: Number,
      required: false,
    },

    name: {
      type: String,
      required: true,
    },

    email: {
      type: String,
      required: true,
    },

    role: {
      type: String,
      default: 'user',
      enum: ['user', 'admin'],
    },

    username: {
      type: String,
      required: true,
    },

    password: {
      type: String,
      required: true,
    },
  },

  { timestamps: true }
);

module.exports = model('users', UserSchema);5
