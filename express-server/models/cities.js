const mongoose = require('mongoose');
const validator = require('validator');

const citiesSchema = new mongoose.Schema({
  name: String,
  country: String,
  capital: {
    type: Boolean,
    required: true
  },
  location: {
      lat: Number,
      long: Number
  },
  lastModifiedDate: Date
});

citiesSchema.pre('save', function(next) {
    this.lastModifiedDate = Date.now();
    next();
});

citiesSchema.pre('update', function(next) {
    this.update({}, { lastModifiedDate: Date.now() });
    next();
});

module.exports = mongoose.model('Cities', citiesSchema);