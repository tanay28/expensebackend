const express = require('express');
const router = express.Router();
const Income = require('../models/Income');
const Ledger = require('../models/Ledger');


var requestChecker = require('../middleware');

router.use(requestChecker)

router.post('/validate', async (req, res) => {

    let data = req.body;
    let user = data.user;
    let month = data.month;
    try{
        const data = await Income.find({ user,month });
        
        if(Object.keys(data).length>0){
            res.send(true);
        }else{
            res.json(true);    
        }   
    }catch(err){
        // console.error(err);
        res.status(500).json('Server error');
    }
});

router.post('/add', async (req, res) => {
    let cData = req.body;
    let user = cData.user;
    let month = cData.month;
    let year = cData.year;
    var obj = {
        source : cData.source,
        amount : cData.amount,
        user   : cData.user,
        month  : cData.month,
        year   : cData.year,
        dt_on  : cData.dt_on,
        date   : new Date(),
    };

    try{
        let income = new Income(obj);
        await income.save();
        let ress = await Ledger.findOne({ user,month,year }).sort({_id:-1});

        if(ress==null){ 
            let ledObj = {
                name    : cData.source,
                opening : 0,
                closing : cData.amount,
                debit   : 0,
                credit  : cData.amount,
                month   : cData.month,
                year    : cData.year,
                dt_on   : cData.dt_on,
                date    : new Date(),
                user    : cData.user,
                status  : "earned"
            }
            let resLed = new Ledger(ledObj);
            await resLed.save();
            res.send(resLed);
        }else{
            let ledObj1 = {
                name    : cData.source,
                opening : ress.closing,
                closing : parseFloat(ress.closing) + parseFloat(cData.amount),
                debit   : 0,
                credit  : cData.amount,
                month   : cData.month,
                year    : cData.year,
                dt_on   : cData.dt_on,
                date    : new Date(),
                user    : cData.user,
                status  : "earned"
            }
            let resLed1 = new Ledger(ledObj1);
            await resLed1.save();
            res.send(resLed1);
        }
        
      }catch(err){
        // console.error(err);
        res.status(500).json('Server error');
      }
});

router.post('/view', async (req, res) => {

    let currentUser = req.body;
    let user = currentUser.email;
    let first = currentUser.first;
    let last = currentUser.last;

    try{
        const data = await Income.find({ user, dt_on:{$gte:first,$lte:last}});
        
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

router.post('/remove', async (req, res) => {

    let id = req.body.id;
    try{
        const st = await Income.findByIdAndRemove(id);
        if(st){
            res.send('deleted');
        }else{
            res.status(403).json('error');    
        }
      }catch(err){
        // console.error(err);
        res.status(500).json('Server error');
      }
});

module.exports = router;