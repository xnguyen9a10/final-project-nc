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
const bcrypt = require('bcryptjs')

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

router.get("/customer/account-list", utils.requireRole('customer'), async (req, res) => {
  const { user } = req
  const customer = await Customer.find({ user_id: user.id })
  const paymentAccount = await Account.find({ account_id: customer[0].paymentAccount.ID })
  const savingAccount = []
  for (let i = 0; i < customer[0].savingAccount.length; i++) {
    const account = await Account.find({ account_id: customer[0].savingAccount[i].ID })
    savingAccount.push(account)
  }
  const result = { paymentAccount, savingAccount }
  return res.status(201).json(result)
})

router.get("/customer/transfer-history/:accountId", utils.requireRole('customer'), async (req, res) => {
  const accountnumber = req.params.accountId
  console.log("chuyển khoản")
  const result = await transactionModel.getByTransfer(accountnumber)
  res.status(201).json(result)
}
)

router.get("/customer/receive-history/:accountId", utils.requireRole('customer'), async (req, res) => {
  const accountnumber = req.params.accountId
  const result = await transactionModel.getByReceiver(accountnumber)
  res.status(201).json(result)
})

router.get("/customer/payment-history/:accountId", utils.requireRole('customer'), async (req, res) => {
  const accountnumber = req.params.accountId
  console.log("Nhắc nợ")
  const result = await transactionModel.getByIspayment(accountnumber)
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

router.post('/customer/change-password', utils.requireRole('customer'), async (req, res) => {
  const { confirmpassword, newpassword, oldpassword } = req.body
  const { user } = req
  if (confirmpassword !== oldpassword) return res.json(fail("Mật khẩu xác nhận không trùng khớp!"))
  else if (confirmpassword === newpassword) return res.json(fail("Mật khẩu mới không được trùng với mật khẩu cũ!"))
  else {
    const customer = await User.findOne({ fullname: user.fullname })
    const validPass = await bcrypt.compare(oldpassword, customer.password)
    if (!validPass) return res.json(fail("Mật khẩu cũ không chính xác!"))
    else {
      const hashedNewPassword = await bcrypt.hash(newpassword, 10)

      const newPassword = await User.findOneAndUpdate({ fullname: user.fullname }, { password: hashedNewPassword })
      console.log(newPassword)
      if (newPassword) res.json(utils.succeed("Thay đổi mật khẩu thành công!"))
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

//------new
router.post("/customer/information", utils.requireRole("customer"), async (req, res, next) => {
  const account_id = req.body.account_id;
  await (Customer.findOne({ "$or": [{ "paymentAccount.ID": account_id }, { "savingAccount.id": account_id }] }).exec((err, row) => {
    if (err) {
      return res.json(fail(err, err.message))
    } else {
      var id = mongoose.Types.ObjectId(row.user_id);
      User.findById(id).exec((err, row1) => {
        if (err) {
          return res.json(fail(err, err.message))
        } else {
          var result = {
            fullname: row1.fullname,
            email: row1.email,
            phone: row.phone
          }
          return res.json(result);
        }
      })
    }
  }))
})

router.get("/customer/contacts", utils.requireRole("customer"), async (req, res, next) => {
  //5ef1cd45b2920b49b416ee36
  await (Customer.findOne({ user_id: req.user.id }).exec((err, row) => {
    if (err) {
      return res.json(fail(err, err.message))
    } else {
      return res.json(row.receivers)
    }
  }))
})

router.post("/customer/create-deb", utils.requireRole("customer"), async (req, res, next) => {
  const deb = req.body;
  console.log(req.user)
  const userid = req.user.id;
  deb.time = Date.now();
  deb.state = 1;
  deb.debType = 1;
  var account_id;
  await Customer.findOneAndUpdate({ user_id: userid }, { "$push": { "debs": deb } }).exec((err, row) => {
    if (err) {
      return res.json(fail(err, err.message))
    } else {
      return Customer.findOne({ "$or": [{ "paymentAccount.ID": deb.accountNumberDeb }, { "savingAccount.ID": deb.accountNumberDeb }] }).exec((err1, row1) => {
        if (err1) {
          return res.json(fail(err1, err1.message))
        } else {
          deb.debType = 2;
          console.log("row1", row1)
          return Customer.findOne({ user_id: userid }).exec((err2, row2) => {
            if (err2) {
              res.json(fail(err2, err2.message))
            } else {
              deb.accountNumberDeb = row2.paymentAccount.ID.toString();
              return Customer.findOneAndUpdate({ "$or": [{ "paymentAccount.ID": row1.paymentAccount.ID }, { "savingAccount.ID": row1.paymentAccount.ID }] }, { "$push": { "debs": deb } }).exec((err3, row3) => {
                if (err3) {
                  return res.json(fail(err3, err3.message))
                } else {
                  return res.json({ message: "Success" })
                }
              })
            }
          })
        }
      })
    }
  })
})

//0:chua thanh toan, 1:ban than tao, 2:nguoi khac tao
router.get("/customer/debs/:type", utils.requireRole("customer"), async (req, res, next) => {
  const type = req.params.type;
  await (Customer.findOne({ user_id: req.user.id }).exec((err, row) => {
    if (err) {
      return res.json(fail(err, err.message))
    } else {
      var result = [];
      if (type == 0) {
        row.debs.forEach(e => {
          if (e.debType != 2 && e.state < 2) {
            result.push(e)
          }
        });
      } else {
        row.debs.forEach(e => {
          if (e.debType == type && e.state !== 0) {
            result.push(e)
          }
        });
      }
      return res.json(result)
    }
  }))
})

router.post("/customer/reject-deb", utils.requireRole("customer"), async (req, res, next) => {
  const content = req.body;
  const userid = req.user.id;
  await (Customer.findOne({ user_id: userid }).exec((err, row) => {
    if (err) {
      res.json(fail(err, err.message));
    } else {
      var change_deb;
      row.debs.forEach(element => {
        var id = mongoose.Types.ObjectId(content.deb_id);
        if (element._id.toString() === id.toString()) {
          element.state = 0
          change_deb = element;
        }
      });
      Customer.findOneAndUpdate({ user_id: userid }, { debs: row.debs }).exec((err1, row1) => {
        if (err1) {
          res.json(fail(err, row));
        } else {
          (Customer.findOne({ "$or": [{ "paymentAccount.ID": change_deb.accountNumberDeb }, { "savingAccount.ID": change_deb.accountNumberDeb }] }).exec((err2, row2) => {
            if (err2 || row2 === null) {
              res.json(fail(err2,"Fail"));
            } else {
              row2.debs.forEach(element => {
                if (element.time == change_deb.time && element.accountNumberDeb == row.paymentAccount.ID) {
                  element.state = 0
                }
              });
              Customer.findOneAndUpdate({ user_id: row2.user_id }, { debs: row2.debs }).exec((err3, row3) => {
                if (err3) {
                  res.json(fail(err3, err3.message))
                } else {
                  res.json({
                    message: "Tu choi thanh cong"
                  })
                }
              })
            }
          }))
        }
      })
    }
  }))
})

router.post("/customer/solve-deb", utils.requireRole("customer"), async (req, res, next) => {
  const content = req.body;
  var time = "1";

  await (Customer.findOne({ user_id: req.user.id }).exec((err, row) => {
    if (err) {
      res.json(fail(err, row));
    } else {
      row.debs.forEach(element => {
        console.log(content, element)
        var id = mongoose.Types.ObjectId(content.deb_id);
        if (element._id.toString() === content.deb_id.toString()) {
          element.state = 2;
          time = element.time;  
        } else {
          if(element.time === content.time) {
            element.state = 2
          }
        }
      });
      return Customer.findOneAndUpdate({ "$or": [{ "debs._id": mongoose.Types.ObjectId(content.deb_id)}, { "savingAccount.ID": row.account_id }] }, { debs: row.debs }).exec((err1, row1) => {
        if (err1) {
          res.json(fail(err, row));
        } else {
          return Customer.update(
            {
              "debs._id": { $ne: mongoose.Types.ObjectId(content.deb_id) },
              "debs.time": time,
            },
            {
              $set: {
                "debs.$.state": 2,
              },
            }
          ).exec((err3, row3) => {
            if (err3) {
              res.json(fail(err3, err3.message));
            } else {
              row3.debs;
              res.json({
                message: "Thanh cong",
              });
            }
            console.log("===================", row3);
          });
        }
      })
    }
  })) 
})

/** ==== NGỌC PART===== */

router.get('/customer/transactions', utils.requireRole("customer"), async (req, res, next) => {
  const accountNumber = req.body.accountNumber;
  const result = await transactionModel.getByAccountNumber(accountNumber);

  res.status(201).json(result);
})

router.post('/customer/transactions', utils.requireRole("customer"), async (req, res, next) => {
  const result = await transactionModel.insert(req.body);
  res.status(201).json(result);
})

const otpModel = require('../../models/otp.model');
const { rsaKeyof47 } = require("../../key");

router.post("/customer/transfer-request", utils.requireRole("customer"), async (req, res) => {
  const { email, receiverAccountNumber, isOutside = false } = req.body;
  try {
    let receiver = null;
    await Account.findOne({ account_id: receiverAccountNumber }).exec((err, row) => {
      if (err) {
        return res.json(fail(err, err.message))
      }
      else {
        receiver = row;
        console.log("Recerver: ", receiver);
        if (receiver == null && !isOutside) {
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
            if(isOutside) {
              await User.update({ _id: req.user.id }, { otp: otp });
            }
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
    var { code, email, receiverAccountNumber, amount } = req.body;
    console.log("SO TIEN CHUYEN LA" + amount)
    var { user } = req
    const holder = await Customer.find({ user_id: user.id })
    const accountholder = await Account.find({ account_id: holder[0].paymentAccount.ID })
    const accountreceiver = await Account.find({ account_id: receiverAccountNumber })
    console.log("nguoi nhan ",accountreceiver);
    console.log("SO DU TAI KHOAN NGUOI NHAN LA:" + accountreceiver[0].balance)
    console.log("so du tai khoan nguoi gui la" + accountholder[0].balance)
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
      console.log("Tai khoan nguoi gui" + accountholder[0].balance)
      if (accountholder[0].balance < amount) return res.json(utils.fail(0, "Balance is not enough money"))
      else {
        await Account.findOneAndUpdate(
          { account_id: holder[0].paymentAccount.ID },
          {
            $inc: {
              balance: -amount
            }
          }).exec()
        await Account.findOneAndUpdate(
          { account_id: receiverAccountNumber },
          {
            $inc: {
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
    else {
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
