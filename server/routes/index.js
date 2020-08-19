const router = require("express").Router();
const bankLink = require("./bankLink");
const mongoose = require("mongoose");
const user = require("./user");
const customer = require("./customer");
const employee = require("./employee");
// const Transaction = mongoose.model("Transaction");
const admin = require("./admin");
const bankLinkService = require("../services/bankLinkService");
const utils = require("../utils/utils")
const jwt = require("jsonwebtoken");
const Account = mongoose.model("Account");
const moment = require("moment");
const transactionModel = require('../models/transaction');
const Outside = mongoose.model('Outside');

function requireLogin(req, res, next) {
  let accessToken = req.header("Authorization");
  if (accessToken && accessToken.startsWith("Bearer ")) {
    // Remove Bearer from string
    accessToken = accessToken.slice(7, accessToken.length);
  }

  jwt.verify(accessToken, "somethingyoudontknow", (err, decoded) => {
    if (err) {
      return res.status(401).send("Not authenticated");
    }
    req.user = decoded.user;
    req.authenticated = true;
    return next();
  });
}

router.get("/api/account/info/:accountNumber", async (req, res) => {
  const accountNumber = req.params.accountNumber;
  try{
  const response = await bankLinkService.validate(
    req.headers,
    req.body,
    accountNumber
  );
  return res.json(utils.succeed(response));
  } catch (e) {
    return res.json(utils.fail("cannot find that account"))
  }
});

router.post("/api/account/money", async (req, res) => {
  try {
    const response = await bankLinkService.transfer(req.headers, req.body);
    const { toAccountNumber, amount } = req.body;
    // await Account.findOneAndUpdate(
    //   { account_id: toAccountNumber },
    //   {
    //     $inc: {
    //       balance: amount,
    //     },
    //   }
    // ).exec((err, result) => {
    //   if (err) return res.json(utils.fail(err.message));
    //   if (result === null)
    //     return res.json(utils.fail("Tài khoản không tồn tại"));
    //   else return res.json(utils.succeed("Nạp tiền thành công"));
    // });

    await Account.findOneAndUpdate(
      { account_id: req.body.toAccountNumber },
      {
        $inc: {
          balance: +req.body.amount,
        },
      }
    );

    await transactionModel.insert({
      accountHolderNumber: req.body.fromAccountNumber,
      transferAmount: req.body.amount,
      content: req.body.content,
      isPayFee: req.body.fee || true,
      receiverAccountNumber: req.body.toAccountNumber,
      isOutside: true,
    });

    const history = new Outside({
      from: req.body.fromAccountNumber,
      to: req.body.toAccountNumber,
      sender: req.body.senderName || "",
      receiver: req.body.receiverName || "",
      time: Date.now() / 1000,
      amount: req.body.amount,
      content: req.body.content,
      bank: req.headers.partnercode === "nanibank" ? "pgp" : "rsa",
    });
  
    await history.save();
    return res.json(utils.succeed(response));
  } catch (e) {
    console.log(e)
    return res.json(utils.fail(e));
  }
});

router.use("/", user);
router.use(requireLogin);
router.use("/", bankLink);
router.use("/", customer);
router.use("/", employee);
router.use("/", admin);

module.exports = router;
