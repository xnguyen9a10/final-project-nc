const router = require('express').Router();
const bankLink = require('./bankLink');
const authentication=require('./customer')
const post=require('./post')

router.use('/', bankLink);
router.use('/customer',authentication);
router.use('/post',post)

module.exports = router;
