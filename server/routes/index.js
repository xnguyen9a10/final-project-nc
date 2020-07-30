const router = require("express").Router();
const bankLink = require("./bankLink");
const mongoose = require("mongoose");
const user = require("./user");
const customer = require("./customer");
const employee = require("./employee");
// const Transaction = mongoose.model("Transaction");
const admin = require("./admin");
const bankLinkService = require("../services/bankLinkService");
const jwt = require("jsonwebtoken");
const Account = mongoose.model("Account");
const moment = require("moment");
const publicKeyArmored = `-----BEGIN PGP PUBLIC KEY BLOCK-----
Version: Keybase OpenPGP v1.0.0
Comment: https://keybase.io/crypto

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
u5RMN8INapOvye5lCw==
=JFcr
-----END PGP PUBLIC KEY BLOCK-----`

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
  const response = await bankLinkService.validate(req.headers, req.body, accountNumber);
  return res.json(utils.succeed(response));
});

router.post("/api/account/money", async (req, res) => {
  try {
    const response = await bankLinkService.transfer(req.headers, req.body);
    const { accountnumber, amount } = req.body;
    await Account.findOneAndUpdate(
      { account_id: accountnumber },
      {
        $inc: {
          balance: amount,
        },
      }
    ).exec((err, result) => {
      if (err) throw err;
      if (result === null) return res.json(utils.fail("Tài khoản không tồn tại"));
      else return res.json(utils.succeed("Nạp tiền thành công"));
    });
    
    await transactionModel.insert({
      accountHolderNumber: req.body.fromAccountNumber,
      transferAmount: req.body.amount,
      content: req.body.content,
      isPayFee: req.body.fee,
      receiverAccountNumber: req.body.toAccountNumber,
      isOutside: true,
    })

    return res.json(utils.succeed(response));
  } catch (e) {
    return res.json(utils.fail(e.message));
  }
});

router.use("/", user);
router.use(requireLogin);
router.use("/", bankLink);
router.use("/", employee);
router.use("/", customer);
router.use("/", admin);


module.exports = router;
