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
  ],
  debs: [
    {
      accountNumberDeb: String,
      amount: Number,
      time: String,
      debType: {
        type: Number,
        enum: [1, 2],
        default :1,
      },
      state: {
        type:Number,
        enum: [0, 1, 2]
      },
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
module.exports = {
  getByAccountNumber: (value) => {
    return new Promise((resolve, reject)=>{
        var model = mongoose.model("Account");
        return model.findOne({account_id: value}).exec((err,row)=>{
            if(err){
                console.log(err)
                reject(err);
            }
            else{
                console.log(row)
                resolve(row);
            }
        })
    })
}
}
module.exports = mongoose.model('Customer', schema);
