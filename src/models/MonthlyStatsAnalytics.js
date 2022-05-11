const { Schema, model } = require('mongoose');

const MonthlyStatsAnalyticsSchema = new Schema(
  {
    month: {
      type: Date,
      required: true,
    },

    columns: {
      type: Array,
      required: true,
    },

    data: {
      type: Array,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = model('analytics_monthly_stats', MonthlyStatsAnalyticsSchema);
