const router = require("express").Router();
const passport = require("passport");
const mongoose = require("mongoose");
const User = mongoose.model("User");
const utils = require("../../utils/utils");
const Customer = mongoose.model("Customer")

router.post("/employee/create-customer", async (req, res) => {
  const { username, fullname, email, password, phone } = req.body;

  return User.findOne({ $or: [{ email }] })
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
            ID:OTP,
            balance:0
          }
        });
      console.log(customer)
      await customer.save();
      return res.json(utils.succeed({ customer }));
    });
});

module.exports = router;
