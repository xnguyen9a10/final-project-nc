const router = require("express").Router();
const UserService = require("../../services/userService");
const passport = require("passport");
const mongoose = require("mongoose");
const User = mongoose.model("User");
const utils = require("../../utils/utils");

router.post("/user/register", async (req, res) => {
  const { fullname, email, password } = req.body;

  return User.findOne({ $or: [{ email }] })
    .exec()
    .then(async (err, existingUser) => {
      if (existingUser) {
        return res.json(utils.fail(err,"Email is already existed, please use another one."));
      }

      const user = new User(req.body);
      await user.save();
      return res.json(utils.succeed({ user, token }));
    });
});

router.post("/user/login", (req, res) => {
  const { password } = req.body;

  return User.findOne({ email: req.body.email })
    .exec()
    .then((user) => {
      let message;

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

router.get("/me", utils.authenticate, (req, res) => {
  return res.json(utils.succeed({name:"xyz"}));
})

router.get("/user/me/access-token", utils.isValidRefreshToken, (req, res) => {
  return req.user.generateAuthToken().then((accessToken) => {
    return res.json(utils.succeed({ accessToken }));
  });
});

module.exports = router;
