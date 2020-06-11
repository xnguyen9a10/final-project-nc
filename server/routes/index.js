const router = require('express').Router();
const bankLink = require('./bankLink');
const user = require('./user');
const employee=require('./employee')

router.use('/', bankLink);
router.use('/', user);
router.use('/',employee)

module.exports = router;
