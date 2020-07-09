const router = require("express").Router();
const sha1 = require("sha1");
const bankLinkService = require("../../services/bankLinkService");
const utils = require("../../utils/utils");
const axios = require("axios");
const NodeRSA = require("node-rsa");
const sha256 = require("sha256");
const listKeys = require("../../key");
const openpgp = require("openpgp");

router.get("/api/account/info/:accountNumber", async (req, res) => {
  console.log(req.headers);
  const accountNumber = req.params.accountNumber;
  const response = await bankLinkService.validate(req.headers, req.body, accountNumber);
  return res.json(utils.succeed(response));
});

router.post("/api/account/money", async (req, res) => {
  console.log(req.headers);
  try {
    const response = await bankLinkService.transfer(req.headers, req.body);
    console.log(response);
    return res.json(utils.succeed(response));
  } catch (e) {
    return res.json(utils.fail(e.message));
  }
});

router.get("/api/rsa-group/:account", async (req, res) => {
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

router.post("/api/transfer/rsagroup", async (req, res) => {
  const ts = Date.now() / 1000;
  const sig = sha1(ts + ":" + JSON.stringify(req.body) + ":thisisatokenfroma");
  const key = new NodeRSA(listKeys.rsaKeyof47);
  const verify = key.sign("thisisatokenfroma", "base64", "base64");
  const id = "rsa-bank";
  
  const body = {
    number: req.body.accountNumber,
    money: req.body.amount,
    username: req.body.name,
    content: req.body.content
  }

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

  //*FOR TESTING *//
  return res.json(utils.succeed({message: "tranfer success"}));
});

router.get("/api/pgpgroup/:account", async (req, res) => {
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
  const timestamp = Date.now() / 1000;
  try {
    const response = await axios.get("http://35.247.178.19/partner/?id=1",{
      headers: {
        name:"nguyenbank",
        origin: "www.nguyen.com",
        timestamp,
        "authen-hash": sha256(timestamp + secretKey + JSON.stringify({}))
      },
    });
    console.log(timestamp + secretKey + JSON.stringify({}))
    return res.json(utils.succeed(response.data));
  } catch (e) {
    return res.json(utils.fail(e, e.message));
  }

  // const data = {
  //   name : "Nguyen Vi Nam",
  //   accountNumber: 123123123,
  // }
  //todo:for testing 
  return res.json(utils.succeed(data));
});

router.post('/api/transfer/pgpgroup', async (req, res) => {
  const passphrase = `nguyen`;
  const secretKey = "himom";

  const body = {
    from_id: req.body.name,
    to_id: req.body.accountNumber,
    amount: req.body.amount,
    message: req.body.content
  }

  const {
    keys: [privateKey],
  } = await openpgp.key.readArmored(listKeys.pgpPrivateKey);

  await privateKey.decrypt(passphrase);

  const { signature: detachedSignature } = await openpgp.sign({
    message: openpgp.cleartext.fromText(secretKey),
    privateKeys: [privateKey],
    detached: true,
  });
  const timestamp = Date.now() / 1000;

  try {
    const response = await axios.post("http://35.247.178.19/partner/transfer", body,{
      headers: {
        origin: "www.nguyen.com",
        name: "nguyenbank",
        timestamp,
        "authen-hash": sha256(timestamp + secretKey + JSON.stringify(body)),
        sig: new Buffer.from(detachedSignature).toString('base64')
      },
    });
    return res.json(utils.succeed(response.data));
  } catch (e) {
    return res.json(utils.fail(e, e.message));
  }
  // return res.json(utils.succeed({message: "tranfer success"}));
})

module.exports = router;
