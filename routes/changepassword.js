const express = require('express');
const router = express.Router();
const config = require('config');
const url = require('url');
const User = require('../models/Url');
const Password = require('../models/Password');
var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");
var BCRYPT_SALT_ROUNDS = 12;
let moment = require("moment");

var requestChecker = require('../middleware');

router.use(requestChecker)

router.post('/changepassword', async (req, res) => {

    const { email, oldp, newp } = req.body;
   
    let users = await User.findOne({email});
    
    if (users) {
        bcrypt.compare(oldp,users.password , function(err,match){
            if(match){
                bcrypt.hash(newp, BCRYPT_SALT_ROUNDS,  async function(err, hash){
                    
                    var conditions = { email: email }
                    ,update = { $set: { password: hash }}
                    ,options = { multi: false };

                    User.update(conditions, update, options, (err, numAffected) =>{
                        if(numAffected){
                            let st = {
                                code : 200,
                                status : 'success',
                                msg : 'changed successfully'
                            }
                            res.send(st);
                        }else{
                            let st = {
                                code : 500,
                                status : 'error',
                                msg : 'server error'
                            }
                            res.send(st);
                        }
                    });
                });
            }else{
                let st = {
                    code : 401,
                    status : 'error',
                    msg : 'wrong password'
                };
                res.send(st);
            }
        });
    }

});


module.exports = router;