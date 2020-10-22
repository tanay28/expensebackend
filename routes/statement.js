const express = require('express');
const router = express.Router();
const Crud = require('../models/Crud');
const Income = require('../models/Income');
const Statement = require('../models/Statement');

var requestChecker = require('../middleware');

router.use(requestChecker)

router.post('/getDatewise', async (req, res) => {

    const { email, from, to } = req.body;

    try{
        let start = new Date(from);
        let end =  new Date(to);
        const edata = await Crud.find({ user : email, dt_on:{$gte:start,$lte:end}},{_id:0,place:0,date:0,user:0,month:0,year:0});
        
        const idata = await Income.find({ user : email, dt_on:{$gte:start,$lte:end}},{_id:0,user:0,month:0,year:0,date:0});

        if(Object.keys(idata).length>0 && Object.keys(edata).length>0){
            let data;
            data = {exp:edata,inc:idata}
            res.send(data);
        }else{
            res.json('No data found');    
        }   
    }catch(err){
        // console.error(err);
        res.status(500).json('Server error');
    }

});

router.post('/getMonthwise', async (req, res) => {

    const { email, month, year } = req.body;

    try{
        const edata = await Crud.find({ user : email, month : month, year : year},{_id:0,place:0,date:0,user:0,month:0,year:0});
        
        const idata = await Income.find({ user : email, month : month, year : year},{_id:0,user:0,month:0,year:0,date:0});

        if(Object.keys(idata).length>0 && Object.keys(edata).length>0){
            let data;
            data = {exp:edata,inc:idata}
            res.send(data);
        }else{
            res.json('No data found');    
        }   
    }catch(err){
        // console.error(err);
        res.status(500).json('Server error');
    }

});

router.post('/getVisualdataDatewise',async (req, res) => {
    
    const { email, from, to } = req.body;

    //console.log(req.body);

    if(from == "" && to == ""){
        try{
            const edata = await Crud.find({ user : email},{_id:0,type:0,place:0,date:0,user:0,month:0,year:0,name:0,__v:0}).sort({dt_on:1});
            
            const idata = await Income.find({ user : email},{_id:0,user:0,month:0,year:0,date:0,source:0,__v:0}).sort({dt_on:1});

            const edata_g = await Crud.aggregate([
                {
                    $match : {user:email}
                },
                {
                    $group : {_id : "$dt_on",amount:{$sum:"$amount"}}
                },
                {$sort:{_id:1}}
            ]);
            //console.log('edata_g',edata_g);
            
            const idata_g = await Income.aggregate([
                {
                    $match : {user:email}
                },
                {
                    $group : {_id : "$dt_on",amount:{$sum:"$amount"}}
                },
                {$sort:{_id:1}}
            ]);
            //console.log('idata_g',idata_g);
            
            const edata_ag = await Crud.aggregate([
                {
                    $match : {user:email}
                },
                {
                    $group : {_id:"$type",total:{$sum:"$amount"}}
                }
            ]);

            if(Object.keys(idata).length>0 || Object.keys(edata).length>0 || Object.keys(edata_ag).length>0){

                // let data;
                // data = {exp:edata,inc:idata}
                // res.send(data);

                var etotal = 0;
                edata.forEach(element => {
                    
                    etotal += element.amount;

                });
                var itotal = 0;
                idata.forEach(element => {
                    
                    itotal += element.amount;

                });

                let data;
                data = {
                    pie : [{
                        type  : "Spent",
                        value : etotal,
                    },{
                        type  : "Balance",
                        value : itotal,
                    },{
                        type : "Savings",
                        value : itotal - etotal
                    }],
                    line : edata_g,
                    line_i : idata_g,
                    pie_cat : edata_ag
                };
                res.send(data);

            }else{
                res.json('No data found');    
            }   
        }catch(err){
            // console.error(err);
            res.status(500).json('Server error: '+err);
        }
    }else{
        try{

            let start = new Date(from);
            let end =  new Date(to);

            const edata = await Crud.find({ user : email,dt_on:{$gte:start,$lte:end}},{_id:0,type:0,place:0,date:0,user:0,month:0,year:0,name:0,__v:0});
            
            const idata = await Income.find({ user : email,dt_on:{$gte:start,$lte:end}},{_id:0,user:0,month:0,year:0,date:0,source:0,__v:0});

            const edata_g = await Crud.aggregate([
                {
                    $match : {user:email,dt_on:{$gte:start,$lte:end}}
                },
                {
                    $group : {_id : "$dt_on",amount:{$sum:"$amount"}}
                },
                {$sort:{_id:1}}
            ]);
            //console.log('edata_g',edata_g);
            const idata_g = await Income.aggregate([
                {
                    $match : {user:email,dt_on:{$gte:start,$lte:end}}
                },
                {
                    $group : {_id : "$dt_on",amount:{$sum:"$amount"}}
                },
                {$sort:{_id:1}}
            ]);
            //console.log('idata_g',idata_g);

            
            const edata_ag = await Crud.aggregate([
                {
                    $match : {user:email,dt_on:{$gte: start,$lte: end}}
                },
                {
                    $group : {_id:"$type",total:{$sum:"$amount"}}
                }
            ]);
            
            //console.log('cat : ',edata_ag);
            if(Object.keys(idata).length>0 || Object.keys(edata).length>0 || Object.keys(edata_ag).length>0){

                // let data;
                // data = {exp:edata,inc:idata}
                // res.send(data);

                var etotal = 0;
                edata.forEach(element => {
                    
                    etotal += element.amount;

                });
                var itotal = 0;
                idata.forEach(element => {
                    
                    itotal += element.amount;

                });

                let data;
                data = {
                    pie : [{
                        type  : "Total Expense",
                        value : etotal,
                    },{
                        type  : "Balance Income",
                        value : itotal,
                    },{
                        type : "Savings",
                        value : itotal - etotal
                    }],
                    line : edata_g,
                    line_i : idata_g,
                    pie_cat : edata_ag
                };
                res.send(data);

            }else{
                res.json('No data found');    
            }   
        }catch(err){
            // console.error(err);
            res.status(500).json('Server error:'+err);
        }
    }

});

router.post('/closeAccount', async (req, res) =>{

    const { email,from,to,month,year } = req.body;

    //--------- Check already closed -----------//
    // try{
    //     const Adata = await Statement.find({user:email,month : month,year : year}).count();
    //     console.log(Adata);
        
    // }catch(error){
    //     console.log(error);
    // }
    const Adata = await Statement.find({user:email,month : month,year : year}).countDocuments();

    console.log(Adata);
    
    //------------------ END ------------------//
    if(Adata == 0){
        let start = new Date(from);
        let end =  new Date(to);

        const edata = await Crud.find({ user : email,dt_on:{$gte:start,$lte:end}},{_id:0,type:0,place:0,date:0,user:0,month:0,year:0,name:0,__v:0});
        
        const idata = await Income.find({ user : email,dt_on:{$gte:start,$lte:end}},{_id:0,user:0,month:0,year:0,date:0,source:0,__v:0});

        if(Object.keys(idata).length>0 || Object.keys(edata).length>0 || Object.keys(edata_ag).length>0){

        
            var etotal = 0;
            edata.forEach(element => {
                
                etotal += element.amount;

            });
            var itotal = 0;
            idata.forEach(element => {
                
                itotal += element.amount;

            });

            let objAcc;
            objAcc = {
                user          : email,
                month         : month,
                year          : year,
                total_inc     : itotal,
                total_exp     : etotal,
                total_savings : itotal - etotal,
                date          : new Date()
            }; 
            let resAcc = new Statement(objAcc);
            await resAcc.save();

            res.send({
                code   : 200,
                status : 'success',
                msg    : null,
                data   : objAcc
            });

        }else{
            res.send({
                code   : 401,
                status : 'error',
                msg    : 'No data found',
                data   : null
            });    
        }   
    }

});

router.post('/accountStats', async (req, res) =>{

    const { email,month,year } = req.body;

    try{
        const stats = await Statement.find({user : email,month:month,year:year});
        
        if(Object.keys(stats).length>0){
            let resObj = {
                status : 'success',
                code   : 200,
                msg    : true,
                data   : stats 
            };

            res.send(resObj);
        }else{
            let resObj = {
                status : 'success',
                code   : 200,
                msg    : false,
                data   : stats 
            };
            res.send(resObj);
        }
    }catch(err){
        let resObj = {
            status : 'error',
            code   : 500,
            msg    : null,
            data   : null
        };
    }
});

module.exports = router;