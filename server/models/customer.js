const mongoose=require('mongoose')
const savingAccountSchema =new mongoose.Schema({
    accountNumber:String,
    balance:Number
})
const customerSchema = new mongoose.Schema({
    username:{
        type:String,
        required: true
    },
    password:{
        type:String,
        required:true,
        min:6,
        max:255
    },
    date:{
        type:Date,
        default:Date.now
    },
    fullname:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    phone:{
        type:Number,
    },
    paymentAccount:{
        accountNumber:String,
        balance:Number
    },
    savingAccount:[savingAccountSchema]
})

module.exports=mongoose.model('customer',customerSchema)
