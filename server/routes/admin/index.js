const router = require("express").Router();
const sha1 = require("sha1");
const utils = require("../../utils/utils");
const mongoose = require("mongoose");
const { identity } = require("lodash");
const Employee = mongoose.model("Employee");
const User = mongoose.model("User");
const Account = mongoose.model("Account");

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
});

router.post("/admin/employee/delete", async (req, res) => {
  const employee = req.body;
  await Employee.findOneAndDelete({ code: employee.code });
  await User.findOneAndDelete({ email: employee.username });

  return res.json(utils.succeed("Delete!"));
});

module.exports = router;
