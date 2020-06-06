const router=require('express').Router()
const Customer=require('../../models/customer')
const bcrypt=require('bcryptjs')
const jwt=require('jsonwebtoken')

router.post('/register',async (req,res)=>{

    const usernameExist=await Customer.findOne({
        username:req.body.username
    })
    if(usernameExist) return res.status(400).send('Username already exists!')
    
    const salt=await bcrypt.genSalt(10)
    const hashedPassword=await bcrypt.hash(req.body.password,salt)

    const customer=new Customer({
        username:req.body.username,
        password:hashedPassword,
        email: req.body.email,
        fullname: req.body.fullname
    });
    try{
        const savedCustomer=await customer.save()
        res.send(savedCustomer)
    }
    catch(err){
        res.status(400).send(err)
    }
})

router.post('/change_password',async (req,res)=>{
    //Find old password
    const customer=await Customer.findOne({username:req.body.username})
    const validPass=await bcrypt.compare(req.body.oldPassword,customer.password)
    if(!validPass) res.status(400).send('Wrong password!')
    
    //Change new password
    const salt=await bcrypt.genSalt(10)
    const hashedNewPassword=await bcrypt.hash(req.body.newPassword,salt)
    const newPassword=await Customer.findOneAndUpdate({username:req.body.username},{password:hashedNewPassword})
    if(newPassword) res.status(400).send('Change Password successfully!')
})

router.post('/login',async (req,res)=>{
    const customer=await Customer.findOne({username:req.body.username});
    if(!customer) return res.status(400).send('Username or Password is wrong')

    const validPass=await bcrypt.compare(req.body.password,customer.password)
    if(!validPass) res.status(400).send('Wrong password!')
    
    const payload={
        username:customer.username,
        email:customer.email,
        fullname: customer.fullname
    }

    const token=jwt.sign(payload,'tudeptraivkl');
    res.header('auth-token',token).send(token)

})

module.exports=router