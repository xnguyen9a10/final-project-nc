const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Promise = require('bluebird')

const schema = new mongoose.Schema({
  user_id: String,
  phone: String,
  paymentAccount: {
    ID: String,
    balance: Number
  },
  savingAccount:[
    {
      ID:String,
      balance:Number
    }
  ]
},
  {
    collection: 'customer',
    timestamps: true
  })



schema.set('toJSON', { getters: true });
schema.set('toObject', { getters: true });


module.exports = mongoose.model('Customer', schema);
