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
const ObjectId = require('mongodb').ObjectId;

router.get("/customer/info", utils.requireRole('customer'), async (req, res) => {
  const response = await CustomerService.vidu();
  return res.json(response);
});

router.get("/customer/get-inside-receiver", utils.requireRole('customer'), async (req, res) => {
  const { user } = req
  const customer = await Customer.find({ user_id: user._id })
  return res.json(customer[0].receivers)
});

router.get("/customer/get-outside-receiver", utils.requireRole('customer'), async (req, res) => {
  const { user } = req
  var customer = await Customer.find({ user_id: user._id })
  return res.json(customer[0].outsideReceivers)
});

router.post("/customer/delete-receiver/:accountnumber", utils.requireRole('customer'), async (req, res) => {
  const { user } = req
  const customer = await Customer.findOne({ user_id: user.id })
  for (let i = 0; i < customer.receivers.length; i++) {
    if (customer.receivers[i].account_id === req.params.accountnumber) {
      customer.receivers.splice(i, 1)
    }
  }
  const update = await Customer.findOneAndUpdate(
    { user_id: user.id },
    { receivers: customer.receivers })
  if (update) return res.json(utils.succeed("Xóa người nhận thành công!"))
  else res.json(utils.fail("Xóa thất bại!"))
})

router.post("/customer/delete-outside-receiver/:accountnumber", utils.requireRole('customer'), async (req, res) => {
  const { user } = req
  const customer = await Customer.findOne({ user_id: user.id })
  for (let i = 0; i < customer.outsideReceivers.length; i++) {
    if (customer.outsideReceivers[i].account_id === req.params.accountnumber) {
      customer.outsideReceivers.splice(i, 1)
    }
  }
  const update = await Customer.findOneAndUpdate(
    { user_id: user.id },
    { outsideReceivers: customer.outsideReceivers })
  if (update) return res.json(utils.succeed("Xóa người nhận thành công!"))
  else res.json(utils.fail("Xóa thất bại!"))
})

router.post("/customer/set-outside-receiver", utils.requireRole('customer'), async (req, res) => {
  const { user } = req
  const { receiver_nickname, receiver_accountNumber, type } = req.body
  const customer = await Customer.find({ user_id: user.id })
  const outsideReceivers = customer[0].outsideReceivers
  for (let i = 0; i < outsideReceivers.length; i++) {
    if (receiver_accountNumber == outsideReceivers[i].account_id) return res.json(utils.fail("Tài khoản này đã tồn tại!"))
    if (receiver_nickname == outsideReceivers[i].nickname) return res.json(utils.fail("Người nhận này đã có trong danh sách!"))
  }
  Customer.findOneAndUpdate(
    { user_id: user.id },
    {
      $push: {
        outsideReceivers: {
          nickname: receiver_nickname,
          account_id: receiver_accountNumber,
          from: type
        }
      }
    })
    .exec((err, result) => {
      if (err) return res.json(fail(err))
      else return res.json(utils.succeed("Thêm người nhận thành công!"))
    })
})

router.post("/customer/set-receiver", utils.requireRole('customer'), async (req, res) => {
  const { user } = req
  const { receiver_nickname, receiver_accountNumber } = req.body
  console.log("Tên gợi nhớ:" + receiver_nickname)
  //check if accountnumber exist
  await Account.findOne({
    account_id: receiver_accountNumber
  }).exec((err, result) => {
    if (err) throw err
    if (result === null) return res.json(utils.fail("Tài khoản không tồn tại!"))
    else {
      //if accountnumber exist, check if account in receiver
      Customer.find({ user_id: user.id }).exec((err, result) => {
        const receivers = result[0].receivers
        console.log("Danh sách người nhận:" + receivers)
        for (let i = 0; i < receivers.length; i++) {
          //if account already in receiver, return error
          if (receiver_accountNumber == receivers[i].account_id) {
            return res.json(utils.fail("Tài khoản này đã có trong danh sách người nhận!"))
          }
        }
        if (receiver_nickname === undefined) {
          console.log("Nếu không có tên gợi nhớ")
          Customer.findOne({
            paymentAccount: {
              ID: receiver_accountNumber
            }
          }).exec((err, result) => {
            var ObjectId = require('mongodb').ObjectId;
            if (err) throw err
            if (result === null) return res.json(utils.fail("Tài khoản không tồn tại!"))
            else User.find(ObjectId(result.user_id))
              .exec((err, result) => {
                if (err) return res.json(utils.fail("Không tìm ra người dùng"))
                if (result) Customer.findOneAndUpdate(
                  { user_id: user.id },
                  {
                    $push: {
                      receivers: {
                        nickname: result[0].fullname,
                        account_id: receiver_accountNumber
                      }
                    }
                  })
                  .exec((err, result) => {
                    if (err) return res.json(utils.fail(err))
                    else return res.json(utils.succeed("Thêm người nhận thành công!"))
                  })

              })
          })
        }
        else {
          Customer.find({ user_id: user.id }).exec((err, result) => {
            const receivers = result[0].receivers
            for (let i = 0; i < receivers.length; i++) {
              if (receiver_accountNumber == receivers[i].account_id)
                return res.json(utils.fail("Tài khoản này đã có trong danh sách người nhận!"))
              if (receiver_nickname == receivers[i].nickname)
                return res.json(utils.fail("Tên này đã có trong danh sách người nhận!"))
            }
            if (err) {
              return res.json(err)
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
                else return res.json(utils.succeed("Thêm người nhận thành công!"))
              })
          })
        }
      })
    }
  })
})

router.get("/customer/account-list", utils.requireRole('customer'), async (req, res) => {
  const { user } = req
  const customer = await Customer.find({ user_id: user.id })
  const paymentAccount = await Account.find({ account_id: customer[0].paymentAccount.ID })
  var savingAccount = []
  for (let i = 0; i < customer[0].savingAccount.length; i++) {
    const account = await Account.find({ account_id: customer[0].savingAccount[i].ID })
    savingAccount.push(account)
  }
  console.log(savingAccount)
  const result = { paymentAccount, savingAccount }
  return res.status(201).json(result)
})

router.get("/customer/transfer-history/", utils.requireRole('customer'), async (req, res) => {
  const { user } = req;
  try {
    await Customer.findOne({ 'user_id': user._id }).exec(async (err, result) => {
      if (err) {
        return res.json(fail(err, err.message))
      }
      else {
        accountholder = result.paymentAccount.ID;
        console.log('accountholder:', accountholder);
        const list = await transactionModel.getByTransfer(accountholder);

        return res.json(succeed(list));
      }
    })
  } catch (ex) {
    return res.json(fail(ex, ex.message));
  }
})


router.get("/customer/receive-history/", utils.requireRole('customer'), async (req, res) => {
  const { user } = req;

  try {
    await Customer.findOne({ 'user_id': user._id }).exec(async (err, result) => {
      if (err) {
        return res.json(fail(err, err.message))
      }
      else {
        accountholder = result.paymentAccount.ID;
        console.log('accountholder:', accountholder);
        const list = await transactionModel.getByReceiver(accountholder);

        return res.json(succeed(list));
      }
    })
  } catch (ex) {
    return res.json(fail(ex, ex.message));
  }
})

router.get("/customer/payment-history/", utils.requireRole('customer'), async (req, res) => {
  const { user } = req;

  try {
    await Customer.findOne({ 'user_id': user._id }).exec(async (err, result) => {
      if (err) {
        return res.json(fail(err, err.message))
      }
      else {
        accountholder = result.paymentAccount.ID;
        console.log('accountholder:', accountholder);
        const list = await transactionModel.getByIspayment(accountholder);
        return res.json(succeed(list));
      }
    })
  } catch (ex) {
    return res.json(fail(ex, ex.message));
  }
})

router.get("/customer/transfer-history/restrict", utils.requireRole('customer'), async (req, res) => {
  const { user } = req;
  try {
    await Customer.findOne({ 'user_id': user._id }).exec(async (err, result) => {
      if (err) {
        return res.json(fail(err, err.message))
      }
      else {
        accountholder = result.paymentAccount.ID;
        console.log('accountholder:', accountholder);
        const list = await transactionModel.getByTransfer(accountholder, true);

        return res.json(succeed(list));
      }
    })
  } catch (ex) {
    return res.json(fail(ex, ex.message));
  }
})


router.get("/customer/receive-history/restrict", utils.requireRole('customer'), async (req, res) => {
  const { user } = req;

  try {
    await Customer.findOne({ 'user_id': user._id }).exec(async (err, result) => {
      if (err) {
        return res.json(fail(err, err.message))
      }
      else {
        accountholder = result.paymentAccount.ID;
        console.log('accountholder:', accountholder);
        const list = await transactionModel.getByReceiver(accountholder, true);

        return res.json(succeed(list));
      }
    })
  } catch (ex) {
    return res.json(fail(ex, ex.message));
  }
})

router.get("/customer/payment-history/restrict", utils.requireRole('customer'), async (req, res) => {
  const { user } = req;

  try {
    await Customer.findOne({ 'user_id': user._id }).exec(async (err, result) => {
      if (err) {
        return res.json(fail(err, err.message))
      }
      else {
        accountholder = result.paymentAccount.ID;
        console.log('accountholder:', accountholder);
        const list = await transactionModel.getByIspayment(accountholder, true);
        return res.json(succeed(list));
      }
    })
  } catch (ex) {
    return res.json(fail(ex, ex.message));
  }
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
              res.json(fail(err2, "Fail"));
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
          if (element.time === content.time) {
            element.state = 2
          }
        }
      });
      return Customer.findOneAndUpdate({ "$or": [{ "debs._id": mongoose.Types.ObjectId(content.deb_id) }, { "savingAccount.ID": row.account_id }] }, { debs: row.debs }).exec((err1, row1) => {
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
const { json } = require("body-parser");

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
            if (isOutside) {
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
    console.log("SO TAI KHOAN NGUOI NHAN LA: " + receiverAccountNumber)
    var { user } = req
    const holder = await Customer.find({ user_id: user.id })
    const accountholder = await Account.find({ account_id: holder[0].paymentAccount.ID })
    const accountreceiver = await Account.find({ account_id: receiverAccountNumber })
    console.log("nguoi nhan ", accountreceiver);
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
// Lưu người nhận: 2TH: có nhập tên gợi nhớ -> lưu bằng tên gợi nhớ, để trống tên gợi nhớ -> Tìm tên bằng stk rồi lưu 
router.post("/customer/save-receiver", utils.requireRole("customer"), async (req, res) => {
  try {
    var { user_id, nickname, account_id } = req.body;
    var receiver = null;

    await Customer.findOne({ "user_id": user_id ,  "receivers": { $elemMatch: { "account_id": account_id } } }).exec(async(err, r) => {
      if (r != null) {
        return res.json(fail("Đã tồn tại tài khoản này"));
      }
      else {
        await Customer.findOne({ "user_id": user_id ,  'receivers': { $elemMatch: { nickname: nickname } } }).exec(async(err, r) => {
          if (r != null) {
            return res.json(fail("Đã tồn tại tên gợi nhớ này"));
          }
          else {
            // Kiểm tra người dùng nhập số tài khoản
            if (nickname.match(/^[0-9]+$/)) {
              console.log("match");
              //await Customer.findOne({ $or: [{ "paymentAccount.ID": account_id }, { receivers: { $elemMatch: { ID: account_id } } }] }).exec(async (err, result) => {
              // tìm người nhận bằng số tài khoản (payment account)
              //await Customer.findOne({ "paymentAccount": {'ID': account_id}}).exec(async (err, result) => {
              await Customer.findOne({ $or: [{ "paymentAccount": { 'ID': account_id } }, { 'savingAccount': { $elemMatch: { ID: account_id } } }] }).exec(async (err, result) => {
                if (err) {
                  console.log("Find error: ", err)
                  res.json(fail("Không tìm thấy số tài khoản này", "Không tìm thấy số tài khoản này"))
                }

                else {
                  receiver = result;
                  if (result == null) {
                    res.json(fail("Không tìm thấy số tài khoản này", "Không tìm thấy tài khoản này"))
                  }
                  // Từ đây lấy user_id của recevier truy vấn vào bảng user để lấy full name. 
                  await User.findOne({ "_id": ObjectId(receiver.user_id) }).exec((err, result) => {
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
        })
      }
    })



  }
  catch (ex) {
    res.json(fail(ex, ex.message));
  }
})

router.post("/customer/edit-receiver", utils.requireRole('customer'), async (req, res) => {
  try {
    const { user } = req
    const { edit_account_id, nickname } = req.body

    Customer.find({ user_id: user.id }).exec((err, result) => {
      if (err) { return res.json(err) }
      const account = result[0];
      console.log(account)
      Customer.updateOne(
        { "_id": account._id, "receivers.account_id": edit_account_id },
        { $set: { "receivers.$.nickname": nickname } }
      ).then((obj) => {
        return res.json(true);
      })
    })
  }
  catch (ex) {
    return res.json(ex.message);
  }
})


router.post("/customer/edit-outside-receiver", utils.requireRole('customer'), async (req, res) => {
  try {
    const { user } = req
    const { edit_account_id, nickname, from } = req.body

    Customer.find({ user_id: user.id }).exec((err, result) => {
      if (err) { return res.json(err) }
      const account = result[0];
      console.log(account)
      Customer.updateOne(
        { "_id": account._id, "outsideReceivers.account_id": edit_account_id },
        { $set: { "outsideReceivers.$.nickname": nickname, "outsideReceivers.$.from": from } }
      ).then((obj) => {
        return res.json(true);
      })
    })
  }
  catch (ex) {
    return res.json(ex.message);
  }
})
module.exports = router;



