const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  firstname : String,
  lastname : String,
  email     : String,
  password  : String,
  date: { type: String, default: Date.now }
});

module.exports = mongoose.model('User', userSchema);

/*const empSchema = new mongoose.Schema({
  id          : String,
  name        : String,
  designation : String,
  salary      : String,
});

module.exports = mongoose.model('Emp', empSchema);*/
