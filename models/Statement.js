const mongoose = require('mongoose');

const statementSchema = new mongoose.Schema({
  user          : String,
  month         : String,
  year          : String,
  total_inc     : Number,
  total_exp     : Number,
  total_savings : Number,
  date          : { type: String, default: Date.now }
});

module.exports = mongoose.model('statement', statementSchema);