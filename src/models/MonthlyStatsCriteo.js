const { Schema, model } = require('mongoose');

const MonthlyStatsCriteoSchema = new Schema(
  {
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

module.exports = model('criteo_monthly_stats', MonthlyStatsCriteoSchema);
