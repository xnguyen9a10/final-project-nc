const mongoose = require('mongoose');
const BankPartner = mongoose.model('BankPartner');
const Customer = mongoose.model('Customer');
const User = mongoose.model('User');
class bankLinkService {
  static async validate(params, body, accountNumber) {
    const { timestamp, partnercode, csi } = params;
    const bankPartner = await BankPartner.findOne({name: partnercode});
    if(bankPartner) {
      try {
        await bankPartner.isValidPartner(timestamp, body, csi);
        await bankPartner.isValidTime(timestamp);
      } catch(e) {
        throw new Error(e.message);
      }
      const customer = await Customer.findOne({"paymentAccount.ID": accountNumber});
      const user = await User.findOne({_id: customer.user_id});
      const data = {
        name: user.fullname
      }
      return Promise.resolve(data);
    }
    throw new Error("Your partner code was wrong !")
  }

  static async transfer(params, body) {
    console.log(params);
    const { timestamp, partnercode, csi, detachedsignature } = params;
    const bankPartner = await BankPartner.findOne({name: partnercode});
    const { name, content, amount, dich } = body;

    if (bankPartner) {
      try {
        await bankPartner.isValidPartner(timestamp, body, csi);
        await bankPartner.isValidTime(timestamp);
        await bankPartner.isValidSign(detachedsignature, partnercode);
        
        return Promise.resolve("Success");
        //Do tranfer stuff
      } catch (e) {
        console.log(e, "xxx")
        throw new Error(e);
      }
    }
    throw new Error("Your partner code was wrong !");
  }
}

module.exports = bankLinkService