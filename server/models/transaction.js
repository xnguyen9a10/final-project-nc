const mongoose = require('mongoose');
const db = require('../utils/db');
const Schema = mongoose.Schema;
const moment = require('moment');

const { now } = require('lodash');

const transaction = new Schema({
    accountHolderNumber: String, // Số tài khoản chủ thẻ
    receiverAccountNumber: String, // Số tài khoản người nhận. 
    transferAmount: Number, //Khoản tiền nhận. 
    transferAt: Date, // Thời gian chuyển
    content: String, 
    isPayment: Boolean, // Thanh toán nhắn nợ. (bool)
    isPayFee: Boolean //  Tra phi giao dich
})

module.exports = {
    all: ()=> {
        return db.load('transactions', transaction);
    },
    insert: (entity) => {
        entity.transferAt = Date.now();
        console.log(entity);
        return db.create('transactions', transaction, entity);
    },


    getByAccountNumber: (value) => {
        return new Promise((resolve, reject)=>{
            var model = mongoose.model('transactions', transaction);
            return model.find({accountHolderNumber: value}).exec((err,rows)=>{
                if(err){
                    reject(err);
                }
                else{
                    resolve(rows);
                }
            })
        })
    }

}
