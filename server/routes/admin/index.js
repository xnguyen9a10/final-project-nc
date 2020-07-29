const router = require("express").Router();
const sha1 = require("sha1");
const utils = require("../../utils/utils");
const mongoose = require("mongoose");
const { identity } = require("lodash");
const Employee = mongoose.model("Employee");
const User = mongoose.model("User");
const Outside = mongoose.model("Outside");
const Account = mongoose.model("Account");
const moment = require('moment');
// router.get("/admin/employee", utils.requireRole('admin'), async (req, res) => {
//   return res.json(response);
// });

router.get("/admin/employee", async (req, res) => {
  await Employee.find({}).exec((err, result) => {
    if (err) throw err;
    else return res.json(result);
  });
});

router.post("/admin/employee/create", async (req, res) => {
  const employee = req.body;
  console.log(employee);
  const { fullname, email, password } = req.body;
  return User.findOne({ email: employee.user })
    .exec()
    .then(async (err, existingUser) => {
      if (existingUser) {
        return res.json(utils.fail(err, "Tên tài khoản đã tồn tại !"));
      }

      const user = new User({
        fullname: employee.name,
        email: employee.username,
        password: employee.password,
        role: "employee",
      });
      await user.save();
      if (user.role === "customer") {
        const customer = new Customer({ user_id: user._id });
        await customer.save();
      } else {
        const _employee = new Employee({
          user_id: user._id,
          code: employee.code,
          name: employee.name,
          phone: employee.phone,
          address: employee.address,
          role: employee.role,
        });
        await _employee.save();
      }
      return res.json(utils.succeed({ user }));
    });
});

router.post("/admin/employee/update", async (req, res) => {
  const employee = req.body;
  await Employee.update(
    { code: employee.code },
    {
      name: employee.name,
      phone: employee.phone,
      address: employee.address,
      role: employee.role,
    }
  );
  return res.json(utils.succeed("Update success!"));

});

router.post("/admin/employee/delete", async (req, res) => {
  const employee = req.body;
  await Employee.findOneAndDelete({ code: employee.code });
  await User.findOneAndDelete({ email: employee.username });

  return res.json(utils.succeed("Delete!"));
});

router.get("/admin/transaction", async (req, res) => {
  const data = await Outside.find({});
  return res.json(utils.succeed(data));
});

router.get("/admin/transactionquery", async (req, res) => {
  var select;
  console.log(req.query)
  const date1 = new Date(req.query.fromDate);
  const date2 = new Date(req.query.toDate);

  if(req.query.select && req.query.select !== 'all') {
    select = req.query.select
  }

  if (!req.query.fromDate && !req.query.select) {
    const data = await Outside.find({});
    return data;
  }

  if(req.query.fromDate && !req.query.select || req.query.select === 'all') {
    const data = await Outside.find({time: {
      $gte: moment(date1).startOf("day").unix(),
      $lte: moment(date2).endOf("day").unix(),
    }});
    return res.json(utils.succeed(data));
  }

  if(req.query.fromDate && req.query.select) {
    const data = await Outside.find({bank: req.query.select ,time: {
      $gte: moment(date1).startOf("day").unix(),
      $lte: moment(date2).endOf("day").unix(),
    }});
    return res.json(utils.succeed(data));
  }

});
module.exports = router;
