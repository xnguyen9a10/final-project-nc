const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Promise = require('bluebird')

const account = new mongoose.Schema({
  account_id:String,
  balance:Number,
},
{
  collection:'account',
  timestamps:true
})

const schema = new mongoose.Schema({
  user_id: String,
  phone: String,
  paymentAccount:{ 
    ID: String
  },
  savingAccount:[ 
    {
      ID:String
    }
  ],
  receivers:[
    {
      account_id:String,
      nickname:String
    }
  ]
},
  {
    collection: 'customer',
    timestamps: true
  })



schema.set('toJSON', { getters: true });
schema.set('toObject', { getters: true });

account.set('toJSON', { getters: true });
account.set('toObject', { getters: true });

module.exports = mongoose.model('Account', account);
module.exports = mongoose.model('Customer', schema);
