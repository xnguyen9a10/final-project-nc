const mongoose = require('mongoose');
const sha1 = require('sha1');
const moment = require('moment');

const schema = new mongoose.Schema({
  name: { type: String, required: true },
  secretKey: { type: String, required: true }
},{
  collection: 'partner',
  timestamps: true,
});
schema.set('toJSON', { getters: true });
schema.set('toObject', { getters: true });

schema.methods.isValidPartner = function isValidPartner(timestamp, body, secretKey, csi) {
  const _string = timestamp + JSON.stringify(body) + secretKey;
  
  if (sha1(_string) === csi) {
    return Promise.resolve();
  } else {
    return Promise.reject(new Error("Wrong Credential !"))
  }
};

schema.methods.isValidTime = function isValidTime(timestamp) {
  const currentUnixTime = moment().format('x') / 1000;
  const diff = Math.floor((currentUnixTime - timestamp) / 60);

  if(diff <= 3) {
   return Promise.resolve();
  }
  return Promise.reject(new Error("Your request was expires !"))
  // console.log(moment.duration(currentUnixTime.diff(1589556148.494).asMinutes())
};
module.exports = mongoose.model("BankPartner", schema);