const { Schema, model } = require('mongoose');
const UserSchema = new Schema(
  {
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
      enum: ['user', 'admin'],
      default: 'user',
      required: true,
    },

    state: {
      type: String,
      required: true,
      enum: ['active', 'inactive'],
      default: 'active',
    },

    username: {
      type: String,
      required: true,
      unique: true,
    },

    password: {
      type: String,
      required: true,
    },
  },

  { timestamps: true }
);

module.exports = model('users', UserSchema);
