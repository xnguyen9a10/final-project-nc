const mongoose = require("mongoose");
const sha1 = require("sha1");
const moment = require("moment");
const openpgp = require("openpgp");

const pgpKeyTemp = `-----BEGIN PGP PUBLIC KEY BLOCK-----
Version: Keybase OpenPGP v1.0.0
Comment: https://keybase.io/crypto

xo0EXwcqzQEEANQ8OK/UFVOHOEy5IHkIVJ0yT9VG4xJr56M36vDBs91V6D+GR8cz
P6rwEKdzfLQKgesAqGPNYO1AgDltX3Rr7UcygiQ7/IXH4gi5tsJAx8BrgWuVUiDr
ROPZ7OP8IXGQXyRkICOZ5Vumm35KacZwncPx/om1thWCu7w3zDf3RxKRABEBAAHN
GW52bmFtIDxudm5hbS5jQGdtYWlsLmNvbT7CrQQTAQoAFwUCXwcqzQIbLwMLCQcD
FQoIAh4BAheAAAoJECZB5PEQtj3WwDwD/Rd9cml5qVKA1EijfaTfbphVeBAZEKXc
g/Qbvstuayhv4o3Zbi+5YvkcV6ih+KhcwaITk2iOut9tyMrMsCkdV2ub4iHb6IaN
/8yugEhW1N4GNj9EdpvAL2rFwt1IOCj5q43G9J4zQEYI2BRrel0pA/tBxD+q0Q/L
lko/znCtorbXzo0EXwcqzQEEALh4H29YLGEZWC7cp9T/rvmlTwSnUMAwifpevPOV
UqUrIz3qOaPh1a9vRryo99qQXqK9haPlCsTez0r54TQ70Zol/B5YsQnkTyoxrnP0
xvVeT2lK43ee7jjX4VsWrM7ptYM/IvmlUNW0+vdmI7pxsDH7EZFtNIjyGlkKGpbe
i6VvABEBAAHCwIIEGAEKAA8FAl8HKs0FCQ8JnAACGy4ApwkQJkHk8RC2PdacIAQZ
AQoABgUCXwcqzQAKCRCBCmMloVXacpLhA/MHepxo4tHp8G5lOataSEaQRrovuu2X
VNVTLSTGcfaLwaKdSbKG3i4mvtHYLhiacYtTsTNSRhRcM0fTZ1r8/MYLC4QLxcjg
wyqbHHV6WdJB9urh/3pdyj6sfaHEADePy54i5pCfVum0tOeeIOdkcird7Yini/9T
n2RaUI6n+u6Lwf4D/Rz94pS5cN4kCqTjuAk/QHqYtvm669sXMA7ziEbSaYuwUs1j
KJYtje4T2mJII+6QIH1sngnh94ssxjXnSAaYCdxwRoxKD7q0q30X18S4gcx/vNkr
cn5ZjMgU81urTAxGL7t6yaLOaYecRLUmfFUSwWe/O6ZIqOd9+Ql+vC5DGaWWzo0E
XwcqzQEEAMKBdt0mMlHWlBAXs/88RefRibZsmgzPSWH8WLo2jk/E4wtko7C/vs4d
n1GKHK/e1GyBkyPeSxR7JMLCGOER8aLG/VtzTUiQKgxgL6EfdDNkyYvZXN7Z4lBi
j+GxcOMv6tdkSS/zmKd+ZYzDPKLCvkF/DnDHbkpI9I/hymPBwiSBABEBAAHCwIME
GAEKAA8FAl8HKs0FCQ8JnAACGy4AqAkQJkHk8RC2PdadIAQZAQoABgUCXwcqzQAK
CRAraBHHONMLoFKSA/9Fww7nMHQqyZPxZXOMByWylRF+V/ZOhhTQKTiJUR6gRIkq
hpiS2HgeCCfXKN3dvSPv4UNJNawhRgUWc402J/gmmq/Qm+gcEMBBiqo6NAAZ27Ev
RK7SWQXiLF3CST56FmwxfEOKchxg/w163jF4Z/zjIce5E+SSQZ2L1ZMuS9sjUrjS
BACKk94c6o2AS9omI/JItDUO9L2TPrMTXpwuA/1hPJR/NPXN5S+u9t3ETXxe3R+p
5wSiD6V11JLTwTl/4nP2pn5b3xWzRHYcjFIYc5LtdBciQCeSBgkrNCcmp8wo+6QU
G1eEYWGbnBof0J1e0fUDooQcxMHuhe4pGpGF2AI8RHbNOA==
=pZyz
-----END PGP PUBLIC KEY BLOCK-----`;

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
  console.log(sha1(_string) === csi);

  if (sha1(_string) === csi) {
    return Promise.resolve({ messsage: "Hi rsa-bank" });
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
    return Promise.reject("Your request has expired ");
  }
};

schema.methods.isValidSign = async function isValidSign(detachedSignature) {
    // (async () => {
      console.log(this.secretKey)
      try {
        const verified = await openpgp.verify({
          message: await openpgp.message.fromText(this.secretKey),
          signature: await openpgp.signature.readArmored(
            new Buffer(detachedSignature, "base64").toString("ascii")
          ),
          publicKeys: (await openpgp.key.readArmored(pgpKeyTemp)).keys, // for verification
        });
        const { valid } = verified.signatures[0];

        if (valid) {
          console.log(
            "Signed by key id " + verified.signatures[0].keyid.toHex()
          );
          return Promise.resolve({ message: "Signature verified" });
        } else {
          return Promise.reject("Signature could not be verified");
        }
      } catch (e) {
        return Promise.reject("Signature could not be verified");
      }
    };
  // } catch (e) {
  //   return Promise.reject("Signature could not be verified");
  // }
// };

module.exports = mongoose.model("BankPartner", schema);
