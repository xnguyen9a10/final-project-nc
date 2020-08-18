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
    isPayment: {
        type: Boolean,
        default: false,
    }, // Thanh toán nhắn nợ. (bool)
    isPayFee: Boolean, //  Tra phi giao dich
    isOutside: {
        type: Boolean,
        default: false,
    },
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
    },

    getByTransfer:(value, restrict = false)=>{
        const now = Date.now();
        const t = 30*1000*24*3600
        if (restrict== false){
            return new Promise((resolve, reject)=>{
                var model = mongoose.model('transactions', transaction);
                return model.find({accountHolderNumber: value, isPayment:false} ).exec((err,rows)=>{
                    if(err){
                        reject(err);
                    }
                    else{
                        resolve(rows);
                    }
                })
            })
        }
        else {
            return new Promise((resolve, reject)=>{
                var model = mongoose.model('transactions', transaction);
                return model.find({accountHolderNumber: value, isPayment:false,  transferAt: { $gt: now-t } } ).exec((err,rows)=>{
                    if(err){
                        reject(err);
                    }
                    else{
                        resolve(rows);
                    }
                })
            })
        }
    },

    getByReceiver:(value, restrict=false)=>{
        console.log(value)
        if (restrict== false){
            return new Promise((resolve, reject)=>{
                var model = mongoose.model('transactions', transaction);
                return model.find({receiverAccountNumber: value,
                }).exec((err,rows)=>{
                    if(err){
                        reject(err);
                    }
                    else{
                        resolve(rows);
                    }
                })
            })
        }
        else{
            const now = Date.now();
            const t = 30*1000*24*3600
            return new Promise((resolve, reject)=>{
                var model = mongoose.model('transactions', transaction);
                return model.find({receiverAccountNumber: value, transferAt: { $gt: now-t } 
                }).exec((err,rows)=>{
                    if(err){
                        reject(err);
                    }
                    else{
                        resolve(rows);
                    }
                })
            })
        }
    },

    getByIspayment:(value, restrict=false)=>{
        if(restrict==false){
            return new Promise((resolve, reject)=>{
                var model = mongoose.model('transactions', transaction);
                return model.find({accountHolderNumber: value,
                isPayment:true}).exec((err,rows)=>{
                    if(err){
                        reject(err);
                    }
                    else{
                        resolve(rows);
                    }
                })
            })
        }
        else{
            const now = Date.now();
            const t = 30*1000*24*3600
            return new Promise((resolve, reject)=>{
                var model = mongoose.model('transactions', transaction);
                return model.find({accountHolderNumber: value, transferAt: { $gt: now-t },
                isPayment:true}).exec((err,rows)=>{
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

}
