const router = require("express").Router();
const sha1 = require("sha1");
const CustomerService = require("../../services/customerService");
const utils = require("../../utils/utils");
const mongoose = require("mongoose");
const Customer = mongoose.model("Customer");
const Account = mongoose.model("Account");
const transactionModel = require('../../models/transaction');

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

router.get('/customer/transactions', utils.requireRole("customer"), async(req,res, next)=>{
  const accountNumber = req.body.accountNumber;
  const result = await transactionModel.getByAccountNumber(accountNumber);

  res.status(201).json(result);
})

router.post('/customer/transactions', utils.requireRole("customer"), async(req,res,next)=>{
  const result = await transactionModel.insert(req.body);
  res.status(201).json(result);
})

module.exports = router;
