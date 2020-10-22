const mongoose = require('mongoose');

const passSchema = new mongoose.Schema({
  email  : String,
  status : String,
  link   : String,
  date   : Date
});

module.exports = mongoose.model('Password', passSchema,'reset');