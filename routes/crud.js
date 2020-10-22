const express = require('express');
const router = express.Router();
const Crud = require('../models/Crud');
const Ledger = require('../models/Ledger');

var requestChecker = require('../middleware');

router.use(requestChecker)

router.post('/add', async (req, res) => {
    let cData = req.body;
    let user = cData.user;
    let month = cData.month;
    let year = cData.year;
    var obj = {
        name   : cData.name,
        type   : cData.type,
        amount : cData.amount,
        dt_on  : cData.dt_on,
        place  : cData.place,
        date   : new Date(),
        user   : cData.user,
        month  : month,
        year   : year
    };

    try{
        let crud = new Crud(obj);
        await crud.save();
        let ress = await Ledger.findOne({ user,month,year }).sort({_id:-1});
        
        if(ress==null){ 
          let ledObj = {
              name    : cData.name,
              opening : 0,
              closing : 0 - parseFloat(cData.amount),
              debit   : cData.amount,
              credit  : 0,
              month   : cData.month,
              year    : cData.year,
              dt_on   : cData.dt_on,
              date    : new Date(),
              user    : cData.user,
              status  : "spent"
          }
          let resLed = new Ledger(ledObj);
          await resLed.save();
          res.send(resLed);
        }else{
            let ledObj1 = {
                name    : cData.name,
                opening : ress.closing,
                closing : parseFloat(ress.closing) - parseFloat(cData.amount),
                debit   : parseFloat(cData.amount),
                credit  : 0,
                month   : cData.month,
                year    : cData.year,
                dt_on   : cData.dt_on,
                date    : new Date(),
                user    : cData.user,
                status  : "spent"
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
    let first = new Date(currentUser.first);
    let last = new Date(currentUser.last);

    // console.log("start",first);
    // console.log("end",last);
    try{
        let data = await Crud.find({ user:user,dt_on:{$gte:first,$lte:last} }).sort({_id : -1});
       
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
    let user = req.body.user;
    let amount = req.body.amount;
    let month = req.body.month;
    let year = req.body.year;
    let name = req.body.name;
    try{
        const isAvailable = await Crud.findOne({ user });
        
        if(isAvailable._id!=null){
          //const st = await Crud.findByIdAndRemove(id);
          //const st = await Crud.findOneAndRemove(id);
          const st = await Crud.deleteOne({_id:id});
          if(st){
              let ress = await Ledger.findOne({ user,month,year }).sort({_id:-1});

              if(ress==null){ 
                let ledObj = {
                    name    : name,
                    opening : 0,
                    closing : 0 + parseFloat(amount),
                    debit   : 0,
                    credit  : amount,
                    month   : month,
                    year    : year,
                    dt_on   : new Date(),
                    date    : new Date(),
                    user    : user,
                    status  : "deleted"
                }
                let resLed = new Ledger(ledObj);
                await resLed.save();
                //res.send(resLed);
              }else{
                  let ledObj1 = {
                      name    : name,
                      opening : ress.closing,
                      closing : parseFloat(ress.closing) + parseFloat(amount),
                      debit   : 0,
                      credit  : parseFloat(amount),
                      month   : month,
                      year    : year,
                      dt_on   : new Date(),
                      date    : new Date(),
                      user    : user,
                      status  : "deleted"
                  };
                  let resLed1 = new Ledger(ledObj1);
                  await resLed1.save();
                  //res.send(resLed1);
              }

              res.send('deleted');
          }else{
              res.status(403).json('error');    
          }
        }else{
          res.status(400).json('user not found');
        }
        
      }catch(err){
        // console.error(err);
        res.status(500).json('Server error');
      }
});

router.post('/getType', async (req, res) => {

  const { email } = req.body;
  let data_res;
  try{
    let data = await Crud.find({user:email}).distinct('type');
    data_res = {
      status : "success",
      code : "200",
      msg : "",
      data : data
    };
    res.send(data_res);

  }catch(rr){

    data_res = {
      status : "error",
      code : "401",
      msg : rr,
      data : null
    };
    res.send(data_res);
  }

});

module.exports = router;
