const mongoose = require("mongoose");
const sha1 = require("sha1");
const moment = require("moment");
const openpgp = require("openpgp");

const pgpKeyTemp = `-----BEGIN PGP PUBLIC KEY BLOCK-----
Version: Keybase OpenPGP v1.0.0
Comment: https://keybase.io/crypto

xo0EXzqoHwEEAOlY5cyUOM/9VFjdS0livURy9ZGMCsWTZXG3HUZmm6/PQxOU+C+w
1W6a6QevIuxS3RdUyiaU0tjiTLL3kI4nvN1SgEmIuP5jupTV2DWs8hMXFFeM4eoS
g6PBsft4q8M36+OVnXX5UK6KgLGdoPHdj1De6eUXFUIQgho64Jn7r1hTABEBAAHN
InEgPG5ndXllbnF1b2NkYXQyNTExOTk4QGdtYWlsLmNvbT7CrQQTAQoAFwUCXzqo
HwIbLwMLCQcDFQoIAh4BAheAAAoJEEHqVXtAHsuMeZcD/jYKA9ML6rKlXPyU9nJO
g1JWirO0cYHDqGf5UkmYpullBt5ezdtCYonIJ9qhsfC/gaM063QNVFSMfxojqREw
Fk1V/wqyoGzd+HtDWCPci86Eeoh440Vj6gscd6Rkyy5RgJazH7dC2AwvH575QCTq
0dVkMT/pG3pVuE6aoIGilj/dzo0EXzqoHwEEAModZg1XKyZ5Ze75J2uoCzzSaOVo
BOXnv1W6b2s4KtXFvsN7QYrAdfcclEUUs1rGo7txlTor9/uV5CfsOaZR9PyLesLV
Vq8Xk3WITlK8PnskvVJvcT48HUgFqOQn1+WUDkwYVZ4AmmqzJSsO8tp/rdSWbx5L
VkGJfSTT4Zz8XqkrABEBAAHCwIMEGAEKAA8FAl86qB8FCQ8JnAACGy4AqAkQQepV
e0Aey4ydIAQZAQoABgUCXzqoHwAKCRAQPQ5ZZYb4RDwEA/9GDY5aKVqhYZCrzH0M
9khP72zBWP+c6g8xJCUFY8onwTLvbS7ANiHFHRyWnZhVbtjCAS0OOFEMj/Krfaai
3c8AAy7LKeUIUY/mn+gPpvt5YC6Lt5SFEovhgLbJDaIQQV/wXxBuJ7GxIQhW/bBr
bzpQW3OzW6cpPUfvXNrSoceB69n2BADM9FoBU7v7o2w8s3rQWvJp707Jv+QdgLGi
tBChqYz13SvOorkjtn68fMXg1ulLQw7Rg1RxjJG0+24f47oQ1Gzq1Ho5Kx+R6nq/
ykbX9ynIZfx1kIc7vVR+03FIyxHMH1l11RopKwyVQ8sFtIaMQnPMPNBcz+4FETRH
lxBrr45QW86NBF86qB8BBACxY3UD4pUxyCxEOB5QoA9aRH1Rmya6DySwZSTqvTwa
UUmebqd+QEZbY6lVY5W+Ps+y53Ffgz3Hmw/Yxx4d5HRYemTbZOAQlm9Po07ay4uH
LfygWIneCi7B1/jmllbkB5OQmPoC5vS13UD7bLDOYWrMIVlblDRzC3lsVQIyGKCx
aQARAQABwsCDBBgBCgAPBQJfOqgfBQkPCZwAAhsuAKgJEEHqVXtAHsuMnSAEGQEK
AAYFAl86qB8ACgkQQ0g3FTgNwjTzJQP/QHqGaxK4iKbWz3ffMhskCZ2yt4KkzOHm
AI76Zvq8xXcqwCCf66yD/vZ4dM5zzLTAWlWX72nA1GNy0PH09A2BWl6x3lF/OkvB
mjoa7byEkRjAoLwx8CyGcDbTwIys3GU30nigYt92pnc0zhXGq/iKSciTrqtBClqx
mu8mFeQ8jLWEfwP9FtnvKy+ob/iaW3tPXuwe9lO93GFzDQaSaZzRiJOQAkzP3yp1
OoypGYLN+NZe6DEUtGeaUe0/w76bsqimQfv9/TmOjhb720rkTvOKetjOMB8Xu4dU
ZneYxECtxesucPLQ/nkWFz2NciwCLX6LYUgvz7Fi/MxthKboqA7t4rM7LWk=
=evQR
-----END PGP PUBLIC KEY BLOCK-----`;

const pgpKeyNam = `-----BEGIN PGP PUBLIC KEY BLOCK-----
Version: Keybase OpenPGP v1.0.0
Comment: https://keybase.io/crypto

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
ZGUNTlkge6l6
=YqQ3
-----END PGP PUBLIC KEY BLOCK-----`

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
  const _string = timestamp + JSON.stringify(body) + this.secretKey;

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

schema.methods.isValidSign = async function isValidSign(
  detachedSignature,
  partnercode
) {
  // (async () => {
    // console.log(partnercode, pgpKeyTemp[partnercode] )
  try {
    const verified = await openpgp.verify({
      message: await openpgp.message.fromText(this.secretKey),
      signature: await openpgp.signature.readArmored(
        new Buffer(detachedSignature, "base64").toString("ascii")
      ),
      publicKeys: (await openpgp.key.readArmored(partnercode === 'nanibank' ? pgpKeyNam : pgpKeyTemp)).keys, // for verification
    });
    const { valid } = verified.signatures[0];
    if (valid) {
      console.log("Signed by key id " + verified.signatures[0].keyid.toHex());
      return Promise.resolve({ message: "Signature verified" });
    } else {
      return Promise.reject("Signature could not be verified");
    }
  } catch (e) {
    console.log(e)
    return Promise.reject("Signature could not be verified");
  }
};
// } catch (e) {
//   return Promise.reject("Signature could not be verified");
// }
// };

module.exports = mongoose.model("BankPartner", schema);
