const express = require('express');
const router = express.Router();
const Crud = require('../models/Crud');
var requestChecker = require('../middleware');
const Joi = require('joi');
const expressJoi = require('express-joi-validator');

router.use(requestChecker)

const schema = {
  body: {
      email: Joi.string().required()
  }
}

router.post('/tocsv', expressJoi(schema), async (req, res) => {

    let currentUser = req.body;
    let user = currentUser.email;
    try{
        let data = await Crud.find({ user },{__v:0, _id:0, date:0, user:0});
        res.status(200).json(data);
      }catch(err){
        // console.error(err);
        res.status(500).json('Server error');
      }
});

router.use(function (err, req, res, next) {
  if (err.isBoom) {
       return res.status(err.output.statusCode).json(err.output.payload);
  }
});

module.exports = router;