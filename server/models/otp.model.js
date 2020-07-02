const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let otpShema = new Schema({
    visitorEmail: String,
    otp: String, 
    expiredAt: Date, 
    createAt: Date,
})

module.exports = {
    findLatestOTP: (visitorEmail) => {
        return new Promise((resolve, reject)=>{
            var model = mongoose.model('otp', otpShema);
            return model.find({visitorEmail: visitorEmail}).sort({createAt: -1}).exec((err,records)=>{
                if(err){
                    console.log(err)
                    reject(err);
                }
                else{
                    resolve(records[0]);
                }
            })
        })
    },

    insert: (visitorEmail, otp) => {
        var expiremilis = 600000;
        var instance = {
            visitorEmail: visitorEmail,
            otp: otp,
            createAt: Date.now(),
            expiredAt: Date.now() + expiremilis
        }

        var model = mongoose.model('otp', otpShema);
        var newEnity = model(instance);
        
        return new Promise((resolve, reject)=>{
            return newEnity.save((err)=>{
                if(err){
                    reject(err);
                }
                else {
                    resolve(newEnity);
                }
            })
        })
    }
}

