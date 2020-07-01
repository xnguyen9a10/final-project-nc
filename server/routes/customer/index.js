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
  const result = await transactionModel.insert(req.body);
  res.status(200).json(result);
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

async function forLoop(accounts, result) {
  try{
    console.log('Start')
    for (let i = 0; i < accounts.length; i++) {
      a =  await getByAccountNumber() .getByAccountNumber(accounts[i]+"");
      console.log(a);
      await result.push(a);    
    }  
    console.log('End');
    return result;
  }
  catch(ex){
    return ex;
  }

}

async function getOne(account_id){
  await Account.findOne({account_id: account_id+""}).exec((err,row)=>{
    if(err){
      return false;
    }
    else {
      console.log(row);
      return row
    }
  })
}


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

router.post("/customer/get-accounts", utils.requireRole("customer"), async(req, res)=> {
  const {accounts} = req.body;
  var result = [];

  const propertyPhotoList = [];
  async function getAccountData(item, index){
      console.log(item);
      let response;
      await getOne(item).then((res)=>{
        response = res;
        console.log(res);
      }).catch((err) => {
        console.log(err);
      })

      propertyPhotoList.push(response);
  }
  await Promise.all(accounts.map(getAccountData));
  return res.json(propertyPhotoList);
  
   // console.log('End')
  res.json(succeed(result));
 /* await (async function main() {
    try {
        for (let i = 0; i < accounts.length; i++) {
          console.log(accounts[i] +"");
          await Account.findOne({account_id: (accounts[i]+"")}).exec((err,row)=>{
            if(err){
              res.status(500).json(err);
            }
            else result.push(row);
          })
        }
    }
    catch (ex) {
        console.log(ex.message);
        res.json(fail(message=ex.message));
    }
  })();
  */
  res.json(succeed(result));
})
module.exports = router;
