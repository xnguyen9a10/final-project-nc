const router = require("express").Router();
const sha1 = require("sha1");
const bankLinkService = require("../../services/bankLinkService");
const utils = require("../../utils/utils");
const axios = require("axios");
const NodeRSA = require("node-rsa");
const sha256 = require("sha256");
const listKeys = require("../../key");
const openpgp = require("openpgp");

const publicKeyArmored = `-----BEGIN PGP PUBLIC KEY BLOCK-----
Version: Keybase OpenPGP v1.0.0
Comment: https://keybase.io/crypto

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
u5RMN8INapOvye5lCw==
=JFcr
-----END PGP PUBLIC KEY BLOCK-----`
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
  console.log(new Buffer.from(detachedSignature).toString('base64'))
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
})

module.exports = router;
