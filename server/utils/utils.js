const openpgp = require("openpgp");
const privateKeyArmored = `-----BEGIN PGP PRIVATE KEY BLOCK-----

xcMGBF7E808BCACxinqRPN0uwuMfXw3kBB79tTapTP4rxf93OyBL1U34sZeyw+GE
Wg8exhuapvrcEsFEim+aryLRzKlyVopmeATzOfYoawbLTsXYltt/i/bLo2EJsdHV
SBV5H/nVQBauuAzrY3rkWtB6edD/B+T26Fw90Hn46/5cBS56RwLijNAs40eY2hyd
kSTzXIQtLUmv6WOyH8kHWLEYqovFyWJ66jZywqACOJnkbBhwidEz1/TnSXnkVej5
P0nn14xG5kSv55FUUoEG0OtwL+SEWIfX1lEsgAHUlm7gBm+Is/QZq36ovNtyt+zc
Qt+2evWaEDOa4qbGgkBp2HKqK4e3OV0HG1WvABEBAAH+CQMI5q1vgSTMrNhg0ADA
RgHySyBE3ZnfKcwU4wS9nvgnMKT8BU4SGQYrT9VZjtHbxCphbpTP333nFe3o0QTa
H9PVRX912aLTzAysOLllaJc7A7zNHFXH3QWLhXPc1JVkxXiDyg5WtcPW4zRQV5En
WcYmUYETrvb3sb1gSwxHjYisQnHoZDXXEci/iyL/6T4NEocb/+UWh2RRSDaiE6bT
QQ438JO/x5CIfD/K9Kx8cjoSl3fx3fbeb5S2ppONkNKXuEM75fFkVRRgjEAfMZS6
4RmfSvlYKo29M+/qHARVl7nRvQWykhxohikPjVZ9EUNSRJt/oIDfDDCeS/dRrFZ9
GElb+2NQIUv8T3F94wEehJTHSOlBEbEjZ0ApiihRzKK5PD/O6vFqIRqIkWskHtn0
450CxSI/+Q0v18/Z4gT5pt6X2MV7k9jC8w93r4mkThWc50h6AwkBhrVIYVmI475E
HwS9ZTqHtnErQ68ZoR6ZJ8vver5iRf/DhkPXaVBGWo9AP5+0OTJx4icpN88Tz/j+
wWl4b433ScbS45PzUYV3sLWUFoZPEV6vuQwCYkjacqyahy4LZyavsgl1tuHUXzQF
qqGq2E2u12OmWWnKmpnihXPzWdtE45doD8q+JE/FyP25K2+eGo/L8PV9bXmEWwa1
nCvWkNM9rxqGDBRvUkiva3/CNafCIlBwOOCXxggNPdYLyaRwsCPZDrQI24BbnjWI
vKPJ6hehq9ntJ6tplfAQfNWHpkIbv3hO30wTvd538os673orfnONiqx5K/8KFaRg
nIfc8hvbjh5i8YCWr8pUViXE0faG2j/F+jfdmy+3bbPmbo6G/i/OJbefxLFQMTfv
bgnKG9aVIkJfNJCaRwldXMZ3z/8jZOXMoMWKDdjbOrKTll8n769ccr1JGp1/t2KT
x8ygPuxozZkZzR1OZ3V5ZW4gTmd1eWVuIDxzYWRAZ21haWwuY29tPsLAbQQTAQoA
FwUCXsTzTwIbLwMLCQcDFQoIAh4BAheAAAoJEN42m/Av5mciEEMIAJN8ypM443BK
aRSg4ees1iXWnxCjFDVycwdNbbRGgWIj7cERz0Y6+dPBhijEUJtclsytLGo5Wzja
A9KesWO7LHK7AL7DYoh6C/8pAvsCCrullxyfByevF+Vr7ULrcRHs8Is84fF2/Wen
cSh7eRAr1FEt1rUTaLvzLf+omvvum6A0EnCN8xhKSE+VLFM3B1PCtIYxsyvcigop
27Uxgq+dw2rpbAJ38jGA7jdxhoJBDocTn5Q5TTC/njA+wqKNA3RAhE97hkgSnNxW
rl/A7hRF6nqOsDzMqYmx6nhrZKVN6T0AzLXJg5eLdFKshyjxfMKYP+ZXHWOhURON
QhcPzX/GThnHwwYEXsTzTwEIANQw551V6lS1axOInUOW2ipQRGz0olC9Mysd/HwY
NpX3Gcxn36qEJW93uvJv2OWrc2ghaVaBDxonCEUwRs2ZGMds2HkgeShNQ7lFJo3B
/yXmnJjA1P9UR2ykPQEDRi1H+/6WlZkx83K1WDEfPUHR9uNDW9NqKtcAVzmKrhDp
DYiUWIGe/BeIyOb1UirvYNcEwwcfuneDEbGzU9uyg/Nn586IS0vegheBL1K/9vUB
DqXbKiYvvi4Uq8SEtE8QSV/1Rhuq94E0yvXgBBtmAYpcH8Vjs6NHFp/97WRqmfY4
Pz4aaKPjGKvV7PWPURfjUNsffEE7vMsSxjM1BKN0TQhn/i0AEQEAAf4JAwi5f65h
Ne5XKmB5uIiKhQzsHQgvN1IoGuriR0ZEqhpKOw3CA4A9mDtYudL7UZGuAs75DP1L
sPUh8eGKx2GAb6rRyTWduLlapaNcPL58tG1l+6DHIIn1Uo8SUSA/UGCzSxR6ob20
onzrHyIZz+cyvTMj5/BFGRRGLsn6pdsHtEUugrnjWHHQz+awhZ0TmymKQfzDkt6V
UNybgDnbIOoTUsA+7vHQSSF29NC55aSKLnIOY2Xxk/YVoNNkxC/A5G5xfgnSrLNl
hM4SFZbgx8G9b2JZJD/ygpR8u7vpAWiovhFA3kpG6FxP1MjeBVlTqGdFK3wwSToR
2RENyPLLQ9Nm4k2vwcSZO6suvA4H/JQ+ynZJBjNU/eGJCVbObIu+WcN4hFfLb/6+
nx4GBnpzwfwaDWxkkEbPTHQc9ZBsVodocuKF6Z4tjN3abdRKTdxD+INyWv2XvmXW
KNpkuZiCzM6N1jZ49qyoMUxqGa1QxIO9O684N7tpzRu1Jr10VMzFKPZ+33Hh916i
QyPmcGDAfC4XKhxCB+HmO2Tp54WmCe2J2l8AxjncU4ywmVypXQ68BVm5S150+2dU
I3//wye3v2EDv+xOJ/G/12a8UJmRmjivPMDJRMbCuxYxO1Us9SEEcB18M5TFGSyQ
Kl713mokWw/22bBh27afsWoiLFeyefrBKCSDHlaMTAlw//X50lRkk8+ocGkERNAN
gjHYnHKeLsCjREwvj48dVZEynfC2csq+IODJKwuuyfRQIFBfIJlzdVxX2GXILEk2
9Obug5HgYFZhR5RwQiSBk1KqEPGaCIxctePOUXfMtoICXlJBjKqZKeTIzZZNASrt
Pu4JlPc3YT8K5+y4R7wIX1qnRER+QaJibxHvaP5vpQ4sA4jtZ7h7LIYhXa9Hw/De
lZeSlESr+V83F2BPt9U4rADCwYQEGAEKAA8FAl7E808FCQ8JnAACGy4BKQkQ3jab
8C/mZyLAXSAEGQEKAAYFAl7E808ACgkQMLaMdiMuFwwpnAf/T4NkqeuMj0Caudbg
6ArLY08FTvRFZt+RpqC5sXSVcMPdrx+gcJplgN1YvbxwU1E5C9iqy4DVdlzMNRUD
04DrEu4mFudZ0gNbFoZyxK4b7uGRUVydrHeE8NyEpdzisaXvc1IwlrjU5Le5qIie
wSDD9F7N4z65O9fnWAt2w5m9AdyTq79gBhxKL1x2RHaWuUUTO0UupqxVqONTy+pS
3Uhr8nPLo8O+4FcolSGRCTsDjyX6uGqGCV4uLdR0IdNOzBM4RiHdhlKTl4OJDmZb
SGlOpgoLer1haPFuOgdEtv/cFY7J9nV52sjADqy3cMcjKLBeY2+QyRjuWI9ERfQN
TEDqscMPB/sGqfDIVS9lIUgLB+veZ41UId+VbkIWlEsYVSvYZGK6KASWnFtkyWHy
tLMNunNRHkdlDS+52UM2ODxRr1BD2Dzr66PFABIbISQjHkSCjHQtgDKkpXJCrCB3
R0u/T469W341wZiUi1Jm71qy8c+sFVBraGV4OEC/91WbAfMlpNKfkpgepm4/WtZU
R9nwbv9wn0qGRrGeJGu+HVi9U/emH+VsSixl0G8F4V4Czr/QOWWqagx6lhQ5jbfp
+EUcYt5bEprTMZm+g45keHPmSoqA0o7IRzCrfKGmW+XAa6U/yHbRkTmeUAFBj8sP
1QAiePcADKBRVpunwmLJvARhGLQzbyogx8MGBF7E808BCACzNbr5uQ26ixTEyRR6
efAoe8Aejd3mAYPQ2w0tfeZsO/GChxhgSiReGJ/msYnqQbJNQydeyDTMx24r80yF
uPDJTXr+AQkTEHYcawRLQ36NUvvet48J07lfKft8jTbLDY4JrevWxvLxj6UcC6UA
iUN87jqqNOxjxXLdBqUmtlDZKwgu+va6pcPi/JcJTrVVqYzVNBdZntT0IDI4y8bn
+S7WDAyuRbU/uNo3SLCO87kUG+qPvee6QHbAzypTRjXZ7kxxR9CVdBDI1iw2ErAl
5F/W6TJH961JfzcAJ1XqSO0Wzlb0iVNx2n2f4vZSPRaUNCBpuuF9n+Nbwl8q6Xvk
e7fjABEBAAH+CQMIdYFBAqTbe8lguztZ9fIiRYDgPfQYMEcIjYA/zaXubI4RKaSA
KV3kKaWuk4Sz1DW6IR/kQLz/9LbVSw0HOoejCx19Sa0c+X/w2FdJn/lrdOrT37w6
OLaP8Y8rLy/3WPK5aQCy/flJlzOhhnLlRxfSfTnq4LPwnU6YOjJmPKS5h7p+Og5V
B9CIJaxFmQgfMbfa5U21svX3rkeHmryfQIpACSm66Lb18qL0gVrA4jloQpFF1UTG
/cCUPfEagS4z5qbWjR+jwVGqD6PXvvdOu8dLUdBipHIanYfAUgakasy64aG7n+0C
rvK+CPUl6w3170l+HL/1gGqio8BaFKp9CdIrBYEHZiZkaSM7j7/iBE+tXhYPhWtH
sKaqMgY4PMiXANtF8zSDfbGPAIMq5Mc5PNZNtIql6ubObewXdUEUsvQFToRFJVEn
uprXf6hd4Ah9GzxWCPeTiuZTani2xkSRiH0xA8oJanfEADwRIGocXz6EpjVjE6LF
L87EcrO80SuzWfrX/mnko/V7a4gye2s+48SIjROyCopa99NAhnw5hbFQ7/QYnmoM
TEipTtnZSaw8o4wfPZYnJA44y8edHMBuzZUaJ1sRo66PSj/ll713AXidVV5XVJPm
QREFM6WexR7wP+RFum2g463Mr/ur5ITebxFBa3b6z9LYh21qK21GdgaCR7GLmX3u
G7thbSsJfRS1kOhy8PuYTg3M9oPmbkxed6icKksd5sASOc+VR1VNjplIvK9AGIGm
tEZPUHnC0FcnlIgzqjWKU4QQG2OnW1ARjBd6cXyTlGJcAXgBME3sIj12khmK7dap
HTOBy4RKBmOOM1rCzJ7JeGs9QFBnPhquJIKPQpMYXdKTFYDxVVj5KMz4AI/IXMfm
yos5gfJYjdsCIj3MoFjDnPTFFPLiv/zZ4eqTlGWLOd3fwsGEBBgBCgAPBQJexPNP
BQkPCZwAAhsuASkJEN42m/Av5mciwF0gBBkBCgAGBQJexPNPAAoJEFDhIdCC011b
mjwH/jD8vnI5pbGap1rv85qeIqLI/4i3tS8Sz3QlsAhLiKIZYHJSwakhDx5TrlYd
0y6dkwNz4l3bSxGpC3L54Z9D4PRN7Ta8+Xov69WPc3QVyDDO5yrihEPDRHEcuQUs
1nUO9BIOgkk9wSEvRmkYMzaEfs/LvaxlbQ1M7qdFeLloML3feqayWz/dprkSCBpx
uwTjVSWsFKSRc3c1kqwJKrVmC906PP77vQ76QrzNvaln7Z1ydeDSDQoxxzBfD65q
aTW1HdqXMAgF1Z737rGYqcFL6uHr1ekVH9eb/LujGqt3dh1AvyVfvJwLf5GTfQY7
ste4p5OU0LzotzGCHChJHRODzwrnXgf/eTlCA8+7SGEpaKTRcdukt/bCJc1RTzsF
v4z7lo3BsgegnpJRxcecrPrVwkrmpkiSVHxfuQmoi9f+Xjb7lOr6oC5p7pkXM5O5
a5mWqxfznvVS8Yo7Nh9DgB/ofWlz1ujEgLK0Pqn7jfPpBpSDzDFRK+t7GgJa1GeQ
iXqkbTghgpDCb6no0PVl4D2418xurpDDWV6+A6pN1nNqST9DUku1NJlNmlvU3INN
Z30+KiOLqER1zMibyKm4O2LzVKsq0U5BKSKxaF3Wf+6bME92QZ6aDOq+AEBqeV0F
UkrjNUbLI6QFG6xzeC+akTv7MlZTwasYfagiu5RMN8INapOvye5lCw==
=u2/4
-----END PGP PRIVATE KEY BLOCK-----`;

const passphrase = `nguyen`;
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const User = mongoose.model("User");
const ObjectId = require('mongodb').ObjectId; 
class Utils {
  static async succeedTransfer(message) {
    const {
      keys: [privateKey],
    } = await openpgp.key.readArmored(privateKeyArmored);
    await privateKey.decrypt(passphrase);
    const { data: responseMessage } = await openpgp.encrypt({
      message: openpgp.cleartext.fromText("good"), // CleartextMessage or Message object
      privateKeys: [privateKey], // for signing
    });

    return {
      status: "successful",
      responseMessage,
    };
  }

  static succeed(data) {
    return {
      status: "successful",
      data,
    };
  }

  static fail(err, message) {
    return {
      status: "failed",
      err,
      message,
    };
  }

  // static authenticate(req, res, next) {
  //   let accessToken = req.header("Authorization");
  //   if (accessToken && accessToken.startsWith("Bearer ")) {
  //     // Remove Bearer from string
  //     accessToken = accessToken.slice(7, accessToken.length);
  //   }
  //   jwt.verify(accessToken, "somethingyoudontknow", (err, decoded) => {
  //     if (err) {
  //       return res.status(401).send("401 Unauthorized");
  //     }
  //     req.user = decoded.user;
  //     return next();
  //   });
  // }
  
  static requireRole(role) {
    return (req, res, next) => {
      // if (this.authenticate(req, res, next)) {
      if (req.authenticated) {
        console.log(req.user.role);
        switch (role) {
          case "admin":
            if (req.user.role === role) {
              return next();
            }
            break;
          case "customer":
            if (req.user.role === role) {
              return next();
            }
            break;
          case "employee":
            if (req.user.role === role) {
              return next();
            }
            break;
          default:
            return res.status(403).send("403 Forbidden");
        }
        return res.status(403).send("403 Forbidden");
      }
      return res.status(403).send("403 Forbidden");
    };
  }

  static isValidRefreshToken(req, res, next) {
    const refreshToken = req.headers["refreshtoken"];
    const id = req.headers.userid;

    return User.findOne({ _id: ObjectId(id), token: refreshToken })
      .exec()
      .then((user) => {
        console.log(user)
        if (!user) {
          return res.status(401).send("401 Unauthorized");
        }
        req.user = user;
        next();
      });
  }
}

module.exports = Utils;
