const mongoose = require('mongoose');
const BankPartner = mongoose.model('BankPartner');

class bankLinkService {
  static async validate(params, body) {
    const { timestamp, partnercode, csi } = params;
    const bankPartner = await BankPartner.findOne({name: partnercode});
    if(bankPartner) {
      try {
        await bankPartner.isValidPartner(timestamp, body, csi);
        await bankPartner.isValidTime(timestamp);
      } catch(e) {
        return Promise.resolve(e.message);
      }
      return Promise.resolve("Query successful !")
    }
    return Promise.resolve("Your partner code was wrong !")
  }

  static async transfer(params, body) {
    const { timestamp, partnercode, csi, detachedsignature } = params;
    const bankPartner = await BankPartner.findOne({name: partnercode});
    if (bankPartner) {
      try {
        const a = await bankPartner.isValidPartner(timestamp, body, csi);
        const b = await bankPartner.isValidTime(timestamp);
        const c = await bankPartner.isValidSign(detachedsignature);
        return Promise.resolve("Success");
        //Do tranfer stuff
      } catch (e) {
        return Promise.resolve(e.message);
      }
    }
    return Promise.resolve("Your partner code was wrong !");
  }
}

module.exports = bankLinkService