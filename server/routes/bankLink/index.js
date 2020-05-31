const router = require("express").Router();
const sha1 = require("sha1");
const bankLinkService = require("../../services/bankLinkService");
const utils = require("../../utils/utils");
const axios = require("axios");
const NodeRSA = require("node-rsa");
const sha256 = require("sha256");
const listKeys = require("../../key");
const openpgp = require("openpgp");

router.get("/api/account/info", async (req, res) => {
  console.log(req.headers);
  const response = await bankLinkService.validate(req.headers, req.body);
  return res.json(response);
});

router.post("/api/account/money", async (req, res) => {
  try {
    const response = await bankLinkService.transfer(req.headers, req.body);
    return res.json(response);
  } catch (e) {
    console.log(e.message);
  }
});

router.get("/api/47group", async (req, res) => {
  const ts = Date.now();
  try {
    const response = await axios.get("http://d51236fa.ngrok.io/account/1", {
      headers: {
        id: "rsa-bank",
        ts: ts,
        sig: sha1(ts + ":" + JSON.stringify(req.body) + ":thisisatokenfroma"),
      },
    });

    return res.json(response.data);
  } catch (e) {
    console.log(e);
    return res.json(e.message);
  }
});

router.post("/api/callrsagroup", async (req, res) => {
  const ts = Date.now();
  const sig = sha1(ts + ":" + JSON.stringify(req.body) + ":thisisatokenfroma");
  const key = new NodeRSA(listKeys.rsaKeyof47);
  const verify = key.sign("thisisatokenfroma", "base64", "base64");
  const id = "rsa-bank";

  try {
    const response = await axios.post(
      "http://d30cd9e5.ngrok.io/account/1",
        req.body,
        {
        headers: {
          id,
          ts,
          sig,
          verify,
        },
      }
    );
    return res.json(response.data);
  } catch (e) {
    console.log(e);
    return res.json(e.message);
  }

  // const publicKey = new NodeRSA(listKeys.rsaPublicKeyof47);
  // const verify = publicKey.verify("message", signature, 'base64', 'utf8');
  // console.log(verify);
});

router.post("/api/callpgpgroup", async (req, res) => {
  const passphrase = `nguyen`;
  const secretKey = "himom";
  const {
    keys: [privateKey],
  } = await openpgp.key.readArmored(listKeys.pgpPrivateKey);
  await privateKey.decrypt(passphrase);
  const { signature: detachedSignature } = await openpgp.sign({
    message: openpgp.cleartext.fromText(secretKey),
    privateKeys: [privateKey],
    detached: true,
  });
  const timestamp = Date.now();
  console.log(sha256(timestamp + "himom" + JSON.stringify(req.body)));
  const response = await axios.get("http://d51236fa.ngrok.io/account/1", {
    headers: {
      timestamp,
      "authen-hash": sha256(timestamp + "himom" + JSON.stringify(req.body)),
      sig: detachedSignature,
    },
  });
});

module.exports = router;
