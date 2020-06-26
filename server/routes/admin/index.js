const router = require("express").Router();
const sha1 = require("sha1");
const utils = require("../../utils/utils");
const mongoose = require("mongoose");
const Employee = mongoose.model("Employee");
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

module.exports = router;
