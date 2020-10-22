const mongoose = require('mongoose');

const crudSchema = new mongoose.Schema({
  name   : String,
  type   : String,
  amount : Number,
  dt_on  : Date,
  place  : String,
  date   : { type: String, default: Date.now },
  user   : String,
  month  : String,
  year   : String
});

module.exports = mongoose.model('Crud', crudSchema,"expenses");