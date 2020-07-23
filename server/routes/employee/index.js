const router = require("express").Router();
const passport = require("passport");
const mongoose = require("mongoose");
const User = mongoose.model("User");
const utils = require("../../utils/utils");
const Customer = mongoose.model("Customer");
const Account = mongoose.model("Account");
const Transaction = require("../../models/transaction") 

var ObjectId = mongoose.ObjectId; 

router.post("/employee/create-customer",utils.requireRole('employee'), async (req, res) => {
  const { username, fullname, email, password, phone } = req.body;
  console.log(req.body.email)
  return User.find({email:req.body.email,
                    role:"customer"})
    .exec(async (err, existingUser) => {
      if (existingUser.length>0) {
        return res.json(utils.fail(err, "Email is already existed, please use another one."));
      }
      
      const user = new User(req.body);
      await user.save();
      console.log(user)
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

// router.get("/employee/customer-info/:accountId",utils.requireRole('employee'),async(req,res)=>{
//   const customer=await 
// })

router.get("/employee/customer-list",utils.requireRole('employee'),async(req,res)=>{
   await Customer.find({}).exec((async(err,result)=>{
     if (err) throw err
    var id=[]
    for(let i=0;i<result.length;i++){
      //  User.findById(result[i].user_id).exec((async(err,user)=>{
      //   if(user!==null)  userlist.push(user)
      //   console.log(i)
      //   if(i===result.length-1) return res.json(userlist.length) 
      // }))
      id.push(result[i].user_id)
    }
    await User.find({_id: {$in:id}}).exec((err,result)=>{
      return res.json(result)
    })
  }))
})
router.get("/employee/account-list",utils.requireRole('employee'),async(req,res)=>{
  await Account.find({}).exec((async(err,result)=>{
    if (err) throw err
    return res.json(result)
 }))
})

router.get("/employee/transfer-history/:accountId",utils.requireRole('employee'),async(req,res)=>{
  const accountnumber=req.params.accountId
  console.log(accountnumber)
  const result =await transactionModel.getByTransfer(accountnumber)
  res.status(201).json(result)
}
)

router.get("/employee/receive-history/:accountId",utils.requireRole('employee'),async(req,res)=>{
  const accountnumber=req.params.accountId
  const result =await transactionModel.getByReceiver(accountnumber)
  res.status(201).json(result)
})

router.get("/employee/payment-history/:accountId",utils.requireRole('employee'),async(req,res)=>{
  const accountnumber=req.params.accountId
  const result =await transactionModel.getByIspayment(accountnumber)
  res.status(201).json(result)
})

/**==== NGOC PART */
const transactionModel = require('../../models/transaction');

router.get('/employee/transactions', utils.requireRole('employee'), async (req,res) => {
  const result = await transactionModel.all();

  res.status(201).json(result);
})


module.exports = router;
