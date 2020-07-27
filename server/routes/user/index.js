const router = require("express").Router();
const UserService = require("../../services/userService");
const passport = require("passport");
const mongoose = require("mongoose");
const User = mongoose.model("User");
const Customer = mongoose.model("Customer");
const Employee = mongoose.model("Employee");
const utils = require("../../utils/utils");
const { fail } = require("../../utils/utils");
var otpGenerator = require('otp-generator')
const nodemailer = require("nodemailer");
const bcrypt=require('bcryptjs')

router.post("/user/register", async (req, res) => {
  const { fullname, email, password } = req.body;
  return User.findOne({ email: req.body.email })
    .exec()
    .then(async (err, existingUser) => {
      if (existingUser) {
        console.log(existingUser)
        return res.json(utils.fail(err,"Email is already existed, please use another one."));
      }

      const user = new User(req.body);
      await user.save();
      if(user.role === 'customer') {
        const customer = new Customer({user_id: user._id});
        await customer.save();
      } else {
        const employee = new Employee({user_id: user._id});
        await employee.save();
      }
      return res.json(utils.succeed({ user }));
    });
});

const otpModel = require('../../models/otp.model')


router.post("/user/reset-password", async (req, res) => {
  const { resetemail } = req.body;
  const email=await User.findOne({email:resetemail})
  if(!email) return res.json(fail("Email không tồn tại!"))
  else {
    try {
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
          to: resetemail,
          subject: 'Reset your password',
          html: `
          <div>
          <p>Dear ${resetemail}, </p>
          <p style="margin-top:12px">You have requested to reset your password. Use this verification code to change your password.
          <p>Your verification code is: <span style="font-weight: bold; font-size: 18px;">${otp}<p>The code will be expired in 10 minutes.

          </div>`
        };

        transporter.sendMail(mailOptions, async function (error, info) {
          if (error) {
            console.log(error);
            return res.json(utils.fail(error, error.response));
          } else {
            console.log('Email sent: ' + info.response);
            console.log(otp)
            await otpModel.insert(resetemail, otp);
            return res.json(utils.succeed("Mã xác nhận đã được gửi đến email của bạn"));
          }
        });
  }
  catch (ex) {
    res.json(utils.fail(ex, ex.message));
  }
  }
})

router.post("/user/verify-forget-password", async (req, res) => {
  const {verifycode,email}=req.body
  console.log(verifycode)
  console.log(email)
  try {
    var record = await otpModel.findLatestOTP(email);
    var expired = new Date(record.expiredAt);
    if (expired.getTime() < Date.now()) {
      return res.json(utils.fail(1, "Mã đã hết hiệu lực"));
    }
    if (record.otp == verifycode) {
      return res.json(utils.succeed("Xác thực thành công. Vui lòng nhập mật khẩu mới"));
      }
    
    else {
      return res.json(utils.fail("Mã xác thực không chính xác!"));
    }
  } catch (ex) {
    return res.json(utils.fail(2, ex.message));
  }
})

router.post('/user/change-password',async (req,res)=>{
  const {confirmnewpassword,newpassword,email}=req.body
  if(newpassword!==confirmnewpassword) return res.json(fail("Mật khẩu xác nhận không trùng khớp!"))
  else{
      const hashedNewPassword=await bcrypt.hash(newpassword,10)
      const newPassword=await User.findOneAndUpdate({email:email},{password:hashedNewPassword})
      console.log(newPassword)
        if(newPassword) {
          return res.json(utils.succeed("Cập nhật mật khẩu thành công!"))
        } 
  }
})

router.post("/user/login", (req, res) => {
  const { password } = req.body;

  return User.findOne({ email: req.body.email })
    .exec()
    .then((user) => {
      let message;
      console.log(user)
      if (!user) {
        message = "Wrong password or email";
        return res.json(utils.fail(message));
      }

      return user.isValidPassword(password).then(async (valid) => {
        if (!valid) {
          message = "Wrong password or username";
          return res.json(utils.fail(message));
        }

        const accessToken = await user.generateAuthToken();
        const refreshToken = await user.generateRefreshToken();

        const userCopied = user.toJSON();

        delete userCopied.password;
        delete userCopied.token;

        return res.json(utils.succeed({accessToken, refreshToken, userCopied}));
      });
    });
});

router.get("/me", (req, res) => {
  return res.json(utils.succeed({name:"xyz"}));
})

router.get("/user/me/access-token", utils.isValidRefreshToken, (req, res) => {
  return req.user.generateAuthToken().then((accessToken) => {
    return res.json(utils.succeed({ accessToken }));
  });
});

module.exports = router;
