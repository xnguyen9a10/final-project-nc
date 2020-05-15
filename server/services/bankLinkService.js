const mongoose = require('mongoose');
const BankPartner = mongoose.model('BankPartner');

class bankLinkService {
  static async validate(params, body) {
    const { timestamp, partnercode, csi } = params;
    const bankPartner = await BankPartner.findOne({name: partnercode});
    if(bankPartner) {
      try {
        await bankPartner.isValidPartner(timestamp, body, bankPartner.secretKey, csi);
        await bankPartner.isValidTime(timestamp)
        return Promise.resolve("Good")
      } catch(e) {
        return Promise.resolve(e.message);
      }
    }
    return Promise.resolve("Your partner code was wrong !")
  }
}

module.exports = bankLinkService