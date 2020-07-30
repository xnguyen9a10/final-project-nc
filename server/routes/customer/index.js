const router = require("express").Router();
const sha1 = require("sha1");
const CustomerService = require("../../services/customerService");
const utils = require("../../utils/utils");
const mongoose = require("mongoose");
const Customer = mongoose.model("Customer");
const Account = mongoose.model("Account");
const transactionModel = require('../../models/transaction');
const User = mongoose.model("User");
const nodemailer = require("nodemailer");
var otpGenerator = require('otp-generator')
const bcrypt=require('bcryptjs')


router.get("/customer/info", utils.requireRole('customer'), async (req, res) => {
  const response = await CustomerService.vidu();
  return res.json(response);
});

router.post("/customer/set-receiver", utils.requireRole('customer'), async (req, res) => {
  const { user } = req
  const { receiver_nickname, receiver_accountNumber } = req.body
  console.log(user)
  //check if accountnumber exist
  await Account.findOne({
    account_id: receiver_accountNumber
  }).exec((err, result) => {
    if (err) throw err
    if (result === null) return res.json("Tài khoản không tồn tại!")
    if (receiver_nickname === undefined) {
      Customer.findOne({
        paymentAccount: {
          ID: receiver_accountNumber
        }
      }).exec((err, result) => {
        if (err) throw err
        if (result === null) return res.json("Tài khoản không tồn tại!")
        else return res.json(result)
      })
    }
    else Customer.findOneAndUpdate(
      { user_id: user.id },
      {
        $push: {
          receivers: {
            nickname: receiver_nickname,
            account_id: receiver_accountNumber
          }
        }
      })
      .exec((err, result) => {
        if (err) throw err
        else return res.json(result)
      })
  })
})

router.get("/customer/account-list",utils.requireRole('customer'),async(req,res)=>{
  const {user}=req
  const customer=await Customer.find({user_id:user.id})
 const paymentAccount=await Account.find({account_id:customer[0].paymentAccount.ID})
 const savingAccount=[]
 for(let i=0;i<customer[0].savingAccount.length;i++){
   const account=await Account.find({account_id:customer[0].savingAccount[i].ID})
   savingAccount.push(account)
 }
 const result={paymentAccount,savingAccount}
 return res.status(201).json(result)
})

router.get("/customer/transfer-history/:accountId",utils.requireRole('customer'),async(req,res)=>{
  const accountnumber=req.params.accountId
  console.log("chuyển khoản")
  const result =await transactionModel.getByTransfer(accountnumber)
  res.status(201).json(result)
}
)

router.get("/customer/receive-history/:accountId",utils.requireRole('customer'),async(req,res)=>{
  const accountnumber=req.params.accountId
  const result =await transactionModel.getByReceiver(accountnumber)
  res.status(201).json(result)
})

router.get("/customer/payment-history/:accountId",utils.requireRole('customer'),async(req,res)=>{
  const accountnumber=req.params.accountId
  console.log("Nhắc nợ")
  const result =await transactionModel.getByIspayment(accountnumber)
  res.status(201).json(result)
})

/** ==== NGỌC PART===== */
const { fail, succeed } = require("../../utils/utils");

router.get('/customer/transactions', utils.requireRole("customer"), async (req, res, next) => {
  const accountNumber = req.body.accountNumber;
  const result = await transactionModel.getByAccountNumber(accountNumber);

  res.status(201).json(result);
})

router.post('/customer/transactions', utils.requireRole("customer"), async (req, res, next) => {
  try {
    const result = await transactionModel.insert(req.body);
    return res.json(succeed(result));
  }
  catch (ex) {
    res.json(fail(ex, ex.message));
  }
})

router.post("/customer/get-customer", utils.requireRole('customer'), async (req, res) => {
  const { id } = req.body;

  await Customer.findOne({ user_id: id }).exec((err, result) => {
    if (err) {
      res.status(500).json(err);
    }
    else return res.status(200).json(result);
  })
})

router.post('/customer/change-password',utils.requireRole('customer'),async (req,res)=>{
  const {confirmpassword,newpassword,oldpassword}=req.body
  const {user}=req
  if(confirmpassword!==oldpassword) return res.json(fail("Mật khẩu xác nhận không trùng khớp!"))
  else if(confirmpassword===newpassword) return res.json(fail("Mật khẩu mới không được trùng với mật khẩu cũ!"))
  else{
  const customer=await User.findOne({fullname:user.fullname})
  const validPass=await bcrypt.compare(oldpassword,customer.password)
  if(!validPass) return res.json(fail("Mật khẩu cũ không chính xác!"))
  else {
      const hashedNewPassword=await bcrypt.hash(newpassword,10)

      const newPassword=await User.findOneAndUpdate({fullname:user.fullname},{password:hashedNewPassword})
      console.log(newPassword)
        if(newPassword) res.json(utils.succeed("Thay đổi mật khẩu thành công!"))
  }
  }
})

router.post("/customer/get-account", utils.requireRole("customer"), async (req, res) => {
  const account_id = req.body.account
  await Account.findOne({ account_id: account_id + "" }).exec((err, row) => {
    if (err) {
      return res.json(fail(err, err.message))
    }
    else {
      return res.json(row);
    }
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

const otpModel = require('../../models/otp.model')

router.post("/customer/transfer-request", utils.requireRole("customer"), async (req, res) => {
  const { email, receiverAccountNumber } = req.body;
  try {
    let receiver = null;
    await Account.findOne({ account_id: receiverAccountNumber }).exec((err, row) => {
      if (err) {
        return res.json(fail(err, err.message))
      }
      else {
        receiver = row;
        console.log("Recerver: ", receiver);
        if (receiver == null) {
          return res.json(fail(false, "Receiver's account is not found"))
        }

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
          to: email,
          subject: 'Confirm your transfer',
          html: `
          <div>
          <p>Dear ${email}, </p>
          <p style="margin-top:12px">You have requested a fund transfer on our centuryBank website. 
          <p>Your verification code is: <span style="font-weight: bold; font-size: 18px;">${otp}</span
          <p>The code will be expired in 10 minutes.
          </div>`
        };

        transporter.sendMail(mailOptions, async function (error, info) {
          if (error) {
            console.log(error);
            return res.json(utils.fail(error, error.response));
          } else {
            console.log('Email sent: ' + info.response);
            console.log(otp)
            await otpModel.insert(email, otp);
            return res.json(utils.succeed("Request send successfully"));
          }
        });
      }
    })
  }
  catch (ex) {
    res.json(utils.fail(ex, ex.message));
  }
})

router.post("/customer/verify-transfer", utils.requireRole("customer"), async (req, res) => {
  try {
    var { code, email,receiverAccountNumber,amount } = req.body;
    console.log("SO TIEN CHUYEN LA"+amount)
    var {user}=req
    const holder=await Customer.find({user_id:user.id})
    const accountholder=await Account.find({account_id:holder[0].paymentAccount.ID})
    const accountreceiver=await Account.find({account_id:receiverAccountNumber})
    console.log("SO DU TAI KHOAN NGUOI NHAN LA:"+accountreceiver[0].balance)
    console.log("so du tai khoan nguoi gui la" +accountholder[0].balance)
    var record = await otpModel.findLatestOTP(email);
    var expired = new Date(record.expiredAt);
    console.log(expired.getTime());
    console.log(Date.now());
    console.log(record.otp);
    if (expired.getTime() < Date.now()) {
      return res.json(utils.fail(1, "The code is expired"));
    }
    if (record.otp == code) {
      console.log("Chuyen khoan thanh cong")
      console.log("Tai khoan nguoi gui"+accountholder[0].balance)
      if(accountholder[0].balance<amount) return res.json(utils.fail(0,"Balance is not enough money"))
      else{
        await Account.findOneAndUpdate(
          {account_id:holder[0].paymentAccount.ID},
          {
          $inc:{
            balance: -amount
          }
        }).exec()
        await Account.findOneAndUpdate(
          {account_id:receiverAccountNumber},
          {
          $inc:{
            balance: amount
          }
        }).exec()
      return res.json(utils.succeed(true));
      }
    }
    else {
      return res.json(utils.fail(0, "Code is not correct"));
    }
  } catch (ex) {
    return res.json(utils.fail(2, ex.message));
  }
})
// Đã đến bước này thì tên không thể sai. 
router.post("/customer/save-receiver", utils.requireRole("customer"), async (req, res) => {
  try {
    var { user_id, nickname, account_id } = req.body;
    var receiver = null;

    if (nickname.match(/^[0-9]+$/)) {
      console.log("match");
      await Customer.findOne({ $or: [{ "paymentAccount.ID": account_id }, { receivers: { $elemMatch: { ID: account_id } } }] }).exec(async (err, result) => {
        if (err) {
          console.log("Find error: ", err)
        }

        else {
          receiver = result;
          // Từ đây lấy user_id của recevier truy vấn vào bảng user để lấy full name. 
          await User.findOne({ _id: receiver.user_id }).exec((err, result) => {
            if (err) {
              console.log("Find user id: ,", err);
            }
            else {
              console.log("User found: ,", result);
              nickname = result.fullname;
              console.log(nickname);

              const entity = {
                nickname,
                account_id
              }
              console.log(entity);
              Customer.findOneAndUpdate({ user_id: user_id }, { $push: { receivers: entity } }).exec((err, result) => {
                console.log(result);
                res.json(succeed(entity))
              })
            }
          })
        }
      })
    }
    else{
      const entity = {
        nickname,
        account_id
      }
      console.log(entity);
      Customer.findOneAndUpdate({ user_id: user_id }, { $push: { receivers: entity } }).exec((err, result) => {
        console.log(result);
        res.json(succeed(entity))
      })
    }


  }
  catch (ex) {
    res.json(fail(ex, ex.message));
  }
})

module.exports = router;
