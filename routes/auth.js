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
const API_SECRET = "TANAY123";
// @route     POST /api/auth/login
// @desc      Auth users
router.post('/login', async (req, res) => {
    let email = req.body.username;
    let password = req.body.password;
    //console.log(req.body);
    // return;
    let API_SECRET = "TANAY123";
    try
    {
        let users = await User.findOne({email});
        if (users) {
            if(users){
                bcrypt.compare(password,users.password , function(err,match){
                    if(match){
                        var token = jwt.sign(
                            {
                                id: users._id,
                                role: 1,
                                email: users.email,
                                name: users.firstname
                            },
                            API_SECRET,
                            {
                                expiresIn: '1m'  // expires in 24 hours 86400
                            }   
                        );

                        var refreshedToken = jwt.sign(
                            {
                                id    : users._id,
                                role  : 1,
                                email : users.email,
                                name  : users.firstname
                            },
                            API_SECRET,
                            {
                                expiresIn: '20m'  // expires in 24 hours 86400
                            }   
                        ); 

                        res.status(200).send({ auth: true, token: token, refreshtoken: refreshedToken });
                    }
                    else{
                        let resObj = {
                            status  :"error",
                            code    : 403,
                            message : "Wrong Password"
                        };
                        res.status(403).send(resObj);
                    }
                })
            }
        }else{
            res.status(400).send({ message: "Email address not found" });
        }
    }
    catch(err)
    {
    res.status(500).json('Server error');
    }

});

router.post('/reset', async (req, res) => {

    let { email , pass} = req.body;
    //console.log(email)
    //console.log(pass);
    let API_SECRET = "TANAY123";
    try{
        let users = await User.findOne({email});
        if(users){
            bcrypt.hash(pass, BCRYPT_SALT_ROUNDS,  async function(err, hash){
                var conditions = { email: email }
                ,update = { $set: { password: hash }}
                ,options = { multi: false };
                User.update(conditions, update, options, (err, numAffected) =>{
                    // console.log(numAffected);
                    // console.log(err);
                    res.json(true);
                });
            });
                


        }

    }catch(err){

    }

});

router.post('/validate', async (req, res) => {
    
    let email = req.body.email;
    
    try{
        let pass = await Password.findOne({email}).sort({_id : -1}).limit(1);
        if(pass){
            let link_created = new Date(pass.date);
            let current = new Date();
            let timeDifference = Math.abs(current.getTime() - link_created.getTime());
            var date = new Date(timeDifference);
            //let mins = date.getFullYear()

            let mins = parseInt(moment.utc(moment(current,"DD/MM/YYYY HH:mm:ss").diff(moment(link_created,"DD/MM/YYYY HH:mm:ss"))).format("mm"));
            // console.log(mins);
            if(mins >= 10){
                var conditions = { email: email ,status : "ok"}
                ,update = { $set: { status: 'expired' }}
                ,options = { multi: false };
                Password.update(conditions, update, options, (err, numAffected) =>{
                    console.log(numAffected);
                    //console.log(err);
                });
                res.status(200).json(false);
            }else{
                res.status(200).json(true);
            }
        }else{
            res.status(404).json('Wrong user');
        }
    }catch(err){
        res.status(500).json('Server error');
    }

});

router.post('/refreshToken', async (req, res) =>{

    const { token } = req.body;
    //console.log('in api',token);

    jwt.verify(token,API_SECRET,function (err, decoded) {
		if (err) {
            return res.status(401).send({ auth: false, message: 'Failed to authenticate token.',err:err })
        }else{
            
            var refreshedToken = jwt.sign(
            {
                id    : decoded._id,
                role  : decoded.role,
                email : decoded.email,
                name  : decoded.firstname
            },
            // API_SECRET,
            // {
            //     expiresIn: '22m'  // expires in 22 mins 86400
            // }
            );
            return res.status(200).send({auth:true,token:refreshedToken});    
		}
	})
});

module.exports = router;