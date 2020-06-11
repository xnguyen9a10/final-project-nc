const router = require("express").Router();
const passport = require("passport");
const mongoose = require("mongoose");
const User = mongoose.model("User");
const utils = require("../../utils/utils");

router.post("/employee/register", async (req, res) => {
  console.log(req.body)
  const { fullname, email, password } = req.body;

  return User.findOne({ $or: [{ email }] })
    .exec()
    .then(async (err, existingUser) => {
      if (existingUser) {
        return res.json(utils.fail(err,"Email is already existed, please use another one."));
      }

      const user = new User(req.body);
      await user.save({roles: "employee"});
      return res.json(utils.succeed({ user }));
    });
});

module.exports = router;
