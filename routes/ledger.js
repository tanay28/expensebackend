const express = require('express');
const router = express.Router();

const Ledger = require('../models/Ledger');

var requestChecker = require('../middleware');

router.use(requestChecker)

router.post('/view', async (req, res) => {

    let cData = req.body;
    let user = cData.user;
    let from = cData.from;
    let to = cData.to;

    let data;

    try{
        data = await Ledger.find({ 
            user,
            dt_on : {$gte:from,$lte:to} 
        }).sort({dt_on:-1});

        //data = await Ledger.find({ user }).sort({dt_on:1});
        
        if(Object.keys(data).length>0){
            res.send(data);
        }else{
            res.json('No data found');    
        }
        
      }catch(err){
        // console.error(err);
        res.status(500).json('Server error');
      }
});

module.exports = router;

