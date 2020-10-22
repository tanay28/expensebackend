const mongoose = require('mongoose');

const ledgerSchema = new mongoose.Schema({
    name    : String,
    opening : Number,
    closing : Number,
    debit   : Number,
    credit  : Number,
    month   : String,
    year    : String,
    dt_on   : Date,
    date    : { type: String, default: Date.now },
    user    : String,
    status  : String
  });
  module.exports = mongoose.model('Ledger', ledgerSchema,"ledger");