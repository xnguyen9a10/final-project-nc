const mongoose = require("mongoose");
const sha1 = require("sha1");
const moment = require("moment");
const openpgp = require("openpgp");

// const pgpKeyTemp = `-----BEGIN PGP PUBLIC KEY BLOCK-----
// Version: OpenPGP.js v4.10.4
// Comment: https://openpgpjs.org

// xjMEXso1rxYJKwYBBAHaRw8BAQdAqSXrVzJJez3AGH8gfHbBG/W5X0Q0PFvP   
// MvAGqONsHWLNFURhdCA8ZGF0QGV4YW1wbGUuY29tPsJ4BBAWCgAgBQJeyjWv   
// BgsJBwgDAgQVCAoCBBYCAQACGQECGwMCHgEACgkQDgrU59wEfOhUUwEAwzvG   
// vQYGGj8rx/2KaPs+1QSmy2BaRS4lSXNPEjsN8jUA/1PoKoFJDXg57XmlayJe   
// TVoDobovjuduw1lkkGfsKYwBzjgEXso1rxIKKwYBBAGXVQEFAQEHQCRsGExL   
// bWT/9liMy2gsxg51QiuaaEqNSjNI/fw6DZw0AwEIB8JhBBgWCAAJBQJeyjWv   
// AhsMAAoJEA4K1OfcBHzo+XwBALOha2UY+zdysigJNqCDVuc4znNGvcVqcGY0   
// H9Uup0v2AP9fb5s+fONl9Fj6QA6Um9laKtKNLwF7skcNsTprAL59Bw==       
// =S75v
// -----END PGP PUBLIC KEY BLOCK-----`;


const pgpKeyTemp = `-----BEGIN PGP PUBLIC KEY BLOCK-----
Version: OpenPGP.js v4.10.4
Comment: https://openpgpjs.org

xjMEXso1rxYJKwYBBAHaRw8BAQdAqSXrVzJJez3AGH8gfHbBG/W5X0Q0PFvP   
MvAGqONsHWLNFURhdCA8ZGF0QGV4YW1wbGUuY29tPsJ4BBAWCgAgBQJeyjWv   
BgsJBwgDAgQVCAoCBBYCAQACGQECGwMCHgEACgkQDgrU59wEfOhUUwEAwzvG   
vQYGGj8rx/2KaPs+1QSmy2BaRS4lSXNPEjsN8jUA/1PoKoFJDXg57XmlayJe   
TVoDobovjuduw1lkkGfsKYwBzjgEXso1rxIKKwYBBAGXVQEFAQEHQCRsGExL   
bWT/9liMy2gsxg51QiuaaEqNSjNI/fw6DZw0AwEIB8JhBBgWCAAJBQJeyjWv   
AhsMAAoJEA4K1OfcBHzo+XwBALOha2UY+zdysigJNqCDVuc4znNGvcVqcGY0   
H9Uup0v2AP9fb5s+fONl9Fj6QA6Um9laKtKNLwF7skcNsTprAL59Bw==       
=S75v
-----END PGP PUBLIC KEY BLOCK-----`;

const schema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    secretKey: { type: String, required: true },
    pgpKey: { type: String, required: true },
  },
  {
    collection: "partner",
    timestamps: true,
  }
);
schema.set("toJSON", { getters: true });
schema.set("toObject", { getters: true });

schema.methods.isValidPartner = function isValidPartner(timestamp, body, csi) {
  console.log(body);
  const _string = timestamp + JSON.stringify(body) + this.secretKey;
  console.log(sha1(_string) === csi)

  if (sha1(_string) === csi) {
    return Promise.resolve({messsage: "Hi rsa-bank"});
  } else {
    return Promise.reject(new Error("Wrong Credential !"));
  }
};

schema.methods.isValidTime = function isValidTime(timestamp) {
  const currentUnixTime = moment().format("x") / 1000;
  const diff = Math.floor((currentUnixTime - timestamp) / 60);

  if (diff <= 3) {
    return Promise.resolve();
  } else {
    throw new Error("Your request has expired ");
  }
};

schema.methods.isValidSign = function isValidSign(detachedSignature) {
  try {
  (async () => {
    const verified = await openpgp.verify({
      message:  await openpgp.message.fromText(this.secretKey),
      signature: await openpgp.signature.readArmored(new Buffer(detachedSignature, 'base64').toString('ascii')),
      publicKeys: (await openpgp.key.readArmored(pgpKeyTemp)).keys // for verification
    });
    const { valid } = verified.signatures[0];

    if (valid) {
      console.log("Signed by key id " + verified.signatures[0].keyid.toHex());
      return Promise.resolve({message: "Signature verified"});
    } else {
      throw new Error("Signature could not be verified");
    }
  })() } catch(e) {
    console.log(e.message)
  };
};

module.exports = mongoose.model("BankPartner", schema);
