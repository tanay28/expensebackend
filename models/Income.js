const mongoose = require('mongoose');

const incomeSchema = new mongoose.Schema({
    source : String,
    amount : Number,
    user   : String,
    month  : String,
    year   : String,
    dt_on  : Date,
    date   : { type: String, default: Date.now },
  });
  module.exports = mongoose.model('Income', incomeSchema,"incomeDetails");