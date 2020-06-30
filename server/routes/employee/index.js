const router = require("express").Router();
const passport = require("passport");
const mongoose = require("mongoose");
const User = mongoose.model("User");
const utils = require("../../utils/utils");
const Customer = mongoose.model("Customer");
const Account = mongoose.model("Account");
const Transaction = mongoose.model("Transaction");

var ObjectId = mongoose.ObjectId; 

router.post("/employee/create-customer",utils.requireRole('employee'), async (req, res) => {
  const { username, fullname, email, password, phone } = req.body;

  return User.findOne({ email: req.body.email })
    .exec()
    .then(async (err, existingUser) => {
      if (existingUser) {
        return res.json(utils.fail(err, "Email is already existed, please use another one."));
      }

      const user = new User(req.body);
      await user.save();
      var digits = '0123456789';
      let OTP = '';
      for (let i = 0; i < 9; i++) {
        OTP += digits[Math.floor(Math.random() * 10)];
      }
      const customer = new Customer(
        {
          user_id: user._id,
          phone: req.body.phone,
          paymentAccount: {
            ID: OTP
          },
          savingAccount: [
          ]
        });
      await customer.save();
      const account = new Account({
        account_id: customer.paymentAccount.ID,
        balance: 0
      })
      await account.save()
      return res.json(utils.succeed({ customer }));
    });
});

router.post("/employee/recharge-account",utils.requireRole('employee'), async (req, res) => {
  const { accountnumber, amount } = req.body;
  await Account.findOneAndUpdate(
    {account_id:accountnumber},
    {
    $inc:{
      balance: amount
    }
  }).exec((err,result)=>{
    if(err) throw err
    if(result===null) return res.json("Tài khoản không tồn tại")
    else return res.json("Nạp tiền thành công")
  })
});

router.get("/employee/transaction-history/:customerId",utils.requireRole('employee'),async(req,res)=>{
  const customerId=req.params.customerId
  Customer.findById()
});

router.get("/employee/customer-list",utils.requireRole('employee'),async(req,res)=>{
   await Customer.find({}).exec(((err,result)=>{
     if (err) throw err
    var userlist=[]
    for(let i=0;i<result.length;i++){
       User.findById(result[i].user_id).exec(((err,user)=>{
        if(user!==null) userlist.push(user)
        if(i===result.length-1) return res.json(userlist) 
      }))
    }
  }))
})

module.exports = router;
