const router = require('express').Router();
const bankLink = require('./bankLink');
const user = require('./user');

router.use('/', bankLink);
router.use('/', user);

module.exports = router;
