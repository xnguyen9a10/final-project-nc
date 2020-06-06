const jwt=require('jsonwebtoken')

module.exports=function auth(req,res,next){
    const token=req.header('auth-token');
    if(!token) res.status(401).send('Access Denied!')

    try {
        const verified=jwt.verify(token,'tudeptraivkl')
        req.customer=verified
        next()
    }
    catch(err){
        res.status(400).send('Invalid Token!')
    }
}

