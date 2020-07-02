const router = require("express").Router();
const sha1 = require("sha1");
const CustomerService = require("../../services/customerService");
const utils = require("../../utils/utils");
const mongoose = require("mongoose");
const Customer = mongoose.model("Customer");
const Account = mongoose.model("Account");
const transactionModel = require('../../models/transaction');
const nodemailer = require("nodemailer");
var otpGenerator = require('otp-generator')

router.get("/customer/info", utils.requireRole('customer'), async (req, res) => {
  const response = await CustomerService.vidu();
  return res.json(response);
});

router.get("/customer/account-list",utils.requireRole('customer'),async(req,res)=>{
  const {user}=req
  await Customer.findOne(
    {user_id:user.id})
    .exec((err,result)=>{
    if(err) throw err
    else return res.json(result)
  })
})

router.post("/customer/set-receiver",utils.requireRole('customer'),async(req,res)=>{
  const {user}=req
  const {receiver_nickname,receiver_accountNumber}=req.body
  console.log(user)
  //check if accountnumber exist
  await Account.findOne({
    account_id: receiver_accountNumber
  }).exec((err,result)=>{
    if(err) throw err
    if(result===null) return res.json("Tài khoản không tồn tại!")
    if(receiver_nickname===undefined){
      Customer.findOne({
        paymentAccount:{
          ID: receiver_accountNumber
        }
      }).exec((err,result)=>{
        if(err) throw err
        if(result===null) return res.json("Tài khoản không tồn tại!")
        else return res.json(result)
      })
    }
    else Customer.findOneAndUpdate(
      {user_id:user.id},
      {$push: {
        receivers:{
          nickname:receiver_nickname,
          account_id:receiver_accountNumber
        }
      }
      })
      .exec((err,result)=>{
      if(err) throw err
      else return res.json(result)
    })
  })
})

/** ==== NGỌC PART===== */
const accountModel = require('../../models/account.model');
const { fail, succeed } = require("../../utils/utils");
const { message } = require("openpgp");
const { getByAccountNumber } = require("../../models/account.model");

router.get('/customer/transactions', utils.requireRole("customer"), async(req,res, next)=>{
  const accountNumber = req.body.accountNumber;
  const result = await transactionModel.getByAccountNumber(accountNumber);

  res.status(201).json(result);
})

router.post('/customer/transactions', utils.requireRole("customer"), async(req,res,next)=>{
  try{
    const result = await transactionModel.insert(req.body);
    console.log(result);
    res.json(succeed(result));
  }
  catch(ex){
    res.json(fail(err=ex, message=ex.message));
  }
})

router.post("/customer/get-customer",utils.requireRole('customer'),async(req,res)=>{
  const {id} = req.body;

  await Customer.findOne({user_id: id}).exec((err,result)=>{
    if(err){
      res.status(500).json(err);
    }
    else return res.status(200).json(result);
  })
})

router.post("/customer/get-account", utils.requireRole("customer"), async(req, res)=> {
  const account_id = req.body.account
  console.log(account_id);
  await Account.findOne({account_id: account_id+""}).exec((err,row)=>{
    if(err){
      res.json(fail(err,err.message))
    }
    else {
      res.json(row);
    }
  })
})

const otpModel = require('../../models/otp.model')

router.post("/customer/transfer-request", utils.requireRole("customer"), async(req,res)=> {
  const visitorEmail = req.body.email;
  console.log(visitorEmail);

  try{
    var transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 465,
      secure: true,
      auth: {
        user: 'centurybanking123@gmail.com',
        pass: 'Dinhngoc1'
      }
    });
  
    var otp = otpGenerator.generate(6, { upperCase: false, specialChars: false, alphabets: false, });
    console.log(otp);
    var mailOptions = {
      from: 'centurybanking123@gmail.com',
      to: "dinhngoc123@gmail.com",
      subject: 'Confirm your transfer',
      html: `
      <div>
      <p>Dear ${visitorEmail}, </p>
      <p style="margin-top:12px">You have requested a fund transfer on our centuryBank website. 
      <p>Your verification code is: <span style="font-weight: bold; font-size: 18px;">${otp}</span
      <p>The code will be expired in 10 minutes.
      </div>`
    };
  
    transporter.sendMail(mailOptions, async function(error, info){
      if (error) {
        console.log(error);
        res.json(utils.fail(error, error.response));
      } else {
        console.log('Email sent: ' + info.response);
        console.log(otp)
        await otpModel.insert(visitorEmail, otp);
        res.json(utils.succeed("Request send successfully"));
      }
    });
  }
  catch(ex){
    res.json(utils.fail(ex, ex.message));
  }
})

router.post("/customer/verify-transfer", utils.requireRole("customer"), async(req,res)=> {
  try{
  var {code, email} = req.body;
  

    var record = await otpModel.findLatestOTP(email);
    var expired = new Date(record.expiredAt);

    if(expired.getTime() < Date.now()){
      res.json(utils.fail("expired", "The code is expired"));
    }

    if(record.otp == code){
      res.json(utils.succeed(true));
    }
    else{
      res.json(utils.fail("invalid","Code is not correct"));
    }
  }catch(ex){
    res.json(utils.fail(ex,ex.message));
  }

})

module.exports = router;
