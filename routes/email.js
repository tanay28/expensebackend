const express = require("express");
const router = express.Router();
var nodemailer = require("nodemailer");
const Password = require("../models/Password");

router.post("/sent", async (req, res) => {
  let email = req.body.email;

  let obj = {
    email: email,
    status: "ok",
    link: "http://localhost:4200/resetpassword",
    date: new Date()
  };
  //console.log(obj);

  // let obj = {
  //   email  : email,
  //   status : 'ok',
  //   link   : "http://13.233.144.174/resetpassword",
  //   date   : new Date(),
  // };
  try {
    let pass = new Password(obj);
    await pass.save();
  } catch (err) {
    console.log(err);
  }

  var transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "tmtanay56@gmail.com",
      pass: "myhome9432226223"
    }
  });

  var mailOptions = {
    from: "tmtanay56@gmail.com",
    to: email,
    subject: "Password Recovery",
    html: `
        <h2>Hello ${email}</h2><br>
        <div>
            <p><a href="http://localhost:4200/resetpassword">Click here to reset</a></p>
        </div>
    `
  };

  transporter.sendMail(mailOptions, function(error, info) {
    if (error) {
      // console.log(error);
    } else {
      //console.log('Email sent: ' + info.response);
      res.json(info.response);
    }
  });
});

module.exports = router;
