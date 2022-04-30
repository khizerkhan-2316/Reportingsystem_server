const { Schema, model } = require('mongoose');

const DealerSchema = new Schema(
  {
    dealerId: {
      type: Number,
      required: true,
      unique: true,
    },

    name: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = model('dealers', DealerSchema);
