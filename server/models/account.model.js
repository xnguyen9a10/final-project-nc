/*=== NGOC PART */
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Promise = require('bluebird')
const Account = mongoose.model("Account");

const accountModel = new mongoose.Schema({
  account_id:String, 
  balance:Number,
  createAt: Date,
  updatedAt: Date,
})


module.exports = {
    all: ()=> {
        return db.load('account', accountModel );
    },

    getByAccountNumber: (value) => {
        return new Promise((resolve, reject)=>{
            var model = mongoose.model('account', accountModel);
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


