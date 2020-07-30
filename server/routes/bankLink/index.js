const router = require("express").Router();
const sha1 = require("sha1");
const utils = require("../../utils/utils");
const axios = require("axios");
const NodeRSA = require("node-rsa");
const sha256 = require("sha256");
const listKeys = require("../../key");
const openpgp = require("openpgp");
const mongoose = require("mongoose");
const Outside = mongoose.model('Outside');
const Customer = mongoose.model('Customer');
const transactionModel = require('../../models/transaction');

router.get("/api/rsa-group/:account",utils.requireRole('customer'), async (req, res) => {
  const accountNumber = req.params.account;
  const ts = Date.now() / 1000;
  // try {
  //   const response = await axios.get(`http://5f1ab506fd10.ngrok.io/api/partner-bank/info/${accountNumber}`, {
  //     headers: {
  //       id: "rsa-bank",
  //       ts: ts,
  //       sig: sha1(ts + ":" + JSON.stringify({}) + ":thisisatokenfroma"),
  //     },
  //   });

  //   return res.json(response.data);
  // } catch (e) {
  //   console.log(e);
  //   return res.json(e.message);
  // }

  //*Remember to remove this*//
  const mock = {
    returnCode: 1,
    message: "Get info successful",
    data: [
      {
        name: "Nguyen Dat",
        username: "adminn",
        identityNumber: "",
        balance: "50000",
        walletNumber: 1,
      },
    ],
  };
  
  const data = {
    name : mock.data[0].name,
    accountNumber: mock.data[0].walletNumber,
  }
  //todo:for testing 
  return res.json(utils.succeed(data));
  //* *//
});

router.post("/api/tengoinho", utils.requireRole('customer'), async(req,res) => {
  const a = {
    nickname: req.body.nickname,
    fullname: req.body.fullname,
    from: req.body.from,
    account_id: req.body.account_id,
  }
  await Customer.update({user_id: req.user.id}, {$push: {"outsideReceivers": a}});
  return res.json(utils.succeed({}));
})

router.post("/api/transfer/rsagroup", utils.requireRole('customer'), async (req, res) => {
  const ts = Date.now() / 1000;
  const sig = sha1(ts + ":" + JSON.stringify(req.body) + ":thisisatokenfroma");
  const key = new NodeRSA(listKeys.rsaKeyof47);
  const verify = key.sign("thisisatokenfroma", "base64", "base64");
  const id = "rsa-bank";
  
  const body = {
    number: req.body.toAccountNumber,
    money: req.body.amount,
    username: req.body.senderName,
    content: req.body.content 
  }
  // const transaction = new Transaction({
  //   accountHolderNumber: req.body.fromAccountNumber,
  //   transferAmount: req.body.amount,
  //   content: req.body.content,
  //   isPayFee: req.body.fee,
  //   receiverAccountNumber: req.body.toAccountNumber,
  //   transferAt: new Date()
  // })
  await transactionModel.insert({
    accountHolderNumber: req.body.fromAccountNumber,
    transferAmount: req.body.amount,
    content: req.body.content,
    isPayFee: req.body.fee,
    receiverAccountNumber: req.body.toAccountNumber,
    isOutside: true,
  })
  // try {
  //   const response = await axios.post(
  //     "http://5f1ab506fd10.ngrok.io/api/partner-bank/add-money",
  //       body,
  //       {
  //       headers: {
  //         id,
  //         ts,
  //         sig,
  //         verify,
  //       },
  //     }
  //   );
  //   return res.json(utils.succeed({message: "success"}));
  // } catch (e) {
  //   return res.json(utils.fail(e, e.message));
  // }
  const history = new Outside ({
    from: req.body.fromAccountNumber,
    to: req.body.toAccountNumber,
    sender: req.body.senderName,
    receiver: req.body.receiverName,
    time: Date.now() / 1000,
    amount: req.body.amount,
    content: req.body.content,
    bank: "rsa",
  });

  await history.save();

  //*FOR TESTING *//
  return res.json(utils.succeed({message: "tranfer success"}));
});

router.get("/api/pgpgroup/:account", utils.requireRole('customer'),async (req, res) => {
  const passphrase = `nguyen`;
  const secretKey = "himom";

  const body = {
    name: "nanibank",
    id: req.params.account
  }
  
  // const {
  //   keys: [privateKey],
  // } = await openpgp.key.readArmored(listKeys.pgpPrivateKey);

  // await privateKey.decrypt(passphrase);

  // const { signature: detachedSignature } = await openpgp.sign({
  //   message: openpgp.cleartext.fromText(secretKey),
  //   privateKeys: [privateKey],
  //   detached: true,
  // });

  // const timestamp = Date.now() / 1000;
  // try {
  //   const response = await axios.get("http://35.247.178.19/partner/?id=1",{
  //     headers: {
  //       name:"nguyenbank",
  //       origin: "www.nguyen.com",
  //       timestamp,
  //       "authen-hash": sha256(timestamp + secretKey + JSON.stringify({}))
  //     },
  //   });
  //   console.log(timestamp + secretKey + JSON.stringify({}))
  //   return res.json(utils.succeed(response.data));
  // } catch (e) {
  //   return res.json(utils.fail(e, e.message));
  // }

  const data = {
    name : "Nguyen Vi Nam",
    accountNumber: 123123123,
  }
  //todo:for testing 
  return res.json(utils.succeed(data));
});

router.post('/api/transfer/pgpgroup', utils.requireRole('customer'),async (req, res) => {
  const passphrase = `nguyen`;
  const secretKey = "himom";
  
  await transactionModel.insert({
    accountHolderNumber: req.body.fromAccountNumber,
    transferAmount: req.body.amount,
    content: req.body.content,
    isPayFee: req.body.fee,
    receiverAccountNumber: req.body.toAccountNumber,
    isOutside: true,
  })

  const body = {
    from_id: req.body.senderName,
    to_id: req.body.toAccountNumber,
    amount: req.body.amount,
    message: req.body.content
  }

  // const {
  //   keys: [privateKey],
  // } = await openpgp.key.readArmored(listKeys.pgpPrivateKey);

  // await privateKey.decrypt(passphrase);

  // const { signature: detachedSignature } = await openpgp.sign({
  //   message: openpgp.cleartext.fromText(secretKey),
  //   privateKeys: [privateKey],
  //   detached: true,
  // });

  // console.log(new Buffer.from(detachedSignature).toString('base64'))
  // const a = `LS0tLS1CRUdJTiBQR1AgU0lHTkFUVVJFLS0tLS0NClZlcnNpb246IE9wZW5QR1AuanMgdjQuMTAuNA0KQ29tbWVudDogaHR0cHM6Ly9vcGVucGdwanMub3JnDQoNCndzQmNCQUVCQ2dBR0JRSmZDSTArQUFvSkVEQzJqSFlqTGhjTXE4MEgrd1htNDVxSDRMbmp3cXZwSTViVQ0KRUlBZXIzSTNRSWVLTFAvU3hPRWNTOHJObUd1RGwzMnRaQ05YUzZVNFRXamtQdmdkaGxXdWFoenpucmp5DQpQRDVJdENTK1NwQks2cmx6ZGlOOGZ1bUZTV3I3eWVDeWJkTEVsQVBnenhhY29mM0w5Z2p5Tk9hWVpYdWMNCmxGMUFQSnpxZGcxT1QvTVRFbWlTejI1RGtqZG5mUlNCREJMZ0l2TFo0ZjVHWVlwbmlKL3JXOW9rYWszSQ0KYUFwVVBDTUxweFhlVFAzaEZFZWh3T2JXdDFaUEN6S0lUdHMwNW1nWk5mVUQ5TzFmcmVZN0JPNERNTVo0DQo0b3lrNFMrelRtTUhyLzFKOEZJb3Blc1YrTzlrZHJqV2pUaUxJa2RMUngyUDVpM1R5WmRELzVzcUdnSGcNCmE2OXZIVU15M3F1ZGp6OEp5NmJDU3JVPQ0KPXkyUlQNCi0tLS0tRU5EIFBHUCBTSUdOQVRVUkUtLS0tLQ0K`
  // const verified = await openpgp.verify({
  //   message: openpgp.cleartext.fromText(secretKey), // CleartextMessage or Message object
  //   signature: await openpgp.signature.readArmored(new Buffer(a, "base64").toString("ascii")), // parse detached signature
  //   publicKeys: (await openpgp.key.readArmored(publicKeyArmored)).keys, // for verification
  // });
  // const { valid } = verified.signatures[0];
  // console.log(valid, "valid")
  // if (valid) {
  //   console.log("signed by key id " + verified.signatures[0].keyid.toHex());
  // } else {
  //   throw new Error("signature could not be verified");
  // }

  const timestamp = Date.now() / 1000;
  try {
    // const response = await axios.post("http://35.247.178.19/partner/transfer", body,{
    //   headers: {
    //     origin: "www.nguyen.com",
    //     name: "nguyenbank",
    //     timestamp,
    //     "authen-hash": sha256(timestamp + secretKey + JSON.stringify(body)),
    //     sig: new Buffer.from(detachedSignature).toString('base64')
    //   },
    // });

    const history = new Outside ({
      from: req.body.fromAccountNumber,
      to: req.body.toAccountNumber,
      sender: req.body.senderName,
      receiver: req.body.receiverName,
      time: Date.now() / 1000,
      amount: req.body.amount,
      content: req.body.content,
      bank: "pgp",
    });
  
    await history.save();
  
    // return res.json(utils.succeed(response && response.data || {}));
    return res.json(utils.succeed({}));

  } catch (e) {
    return res.json(utils.fail(e, e.message));
  }
})

module.exports = router;
