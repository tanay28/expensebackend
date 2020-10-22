
const express = require('express');
const router = express.Router();
const config = require('config');
const url = require('url');
const User = require('../models/Url');
var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");
var BCRYPT_SALT_ROUNDS = 12;

// @route     POST /api/registration/users
// @desc      Create new user
router.post('/users', async (req, res) => {
  //console.log(req.body);
  //return;
  let userData = req.body;
  var hash_pass;
  //console.log(userData.firstname);
  var email = userData.email
  var password = userData.password;
  
  try{
     bcrypt.hash(password, BCRYPT_SALT_ROUNDS,  async function(err, hash) {
      // Store hash in password DB.
      hash_pass = hash;
      var obj = {
        firstname: userData.firstname,
        lastname: userData.lastname,
        email: userData.email,
        password: hash_pass,
        date: new Date()
      };
      try{
        let user = new User(obj);
        await user.save();
        res.json(user);
      }catch(err){
        // console.error(err);
        res.status(500).json('Server error');
      }
    })
  }catch(err){
    res.status(500).json('Server error');
  }

  //console.log(userData.firstname);
});

router.post('/Validateuser', async (req, res) => {
  //console.log(req.body.email);
  let userData = req.body;
  //console.log(userData.firstname);
  var email = userData.email
  
  try{
    let users = await User.findOne({email});
    if (users) {
      res.json('exists');
    }else{
      res.json('ok');
    }
  }catch(err){
    res.status(500).json('Server error');
  }

  //console.log(userData.firstname);
});

module.exports = router;


