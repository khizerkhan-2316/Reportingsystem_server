const { Schema, model } = require('mongoose');

const ReportSchema = new Schema(
  {
    dealerId: {
      type: Number,
      required: true,
    },
    month: {
      type: Date,
      required: true,
    },

    ctr: {
      type: Number,
      required: true,
    },

    impressions: {
      type: Number,
      required: true,
    },

    clicks: {
      type: Number,
      required: true,
    },

    cost: {
      type: Number,
      required: true,
    },

    mail: {
      type: Number,
      required: true,
    },

    phone: {
      type: Number,
      required: true,
    },

    otherAds: {
      type: Number,
      required: true,
    },

    shared: {
      type: Number,
      required: true,
    },

    clickHomepage: {
      type: Number,
      required: true,
    },

    favorite: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = model('reports', ReportSchema);
