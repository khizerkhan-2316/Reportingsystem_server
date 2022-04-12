const { Schema, model } = require('mongoose');

const CountrySchema = new Schema(
  {
    data: {},
  },
  { timestamps: true }
);

CountrySchema.set('autoIndex', false);

module.exports = model('countries', CountrySchema);
