const router = require('express').Router();
const bankLink = require('./bankLink');

router.use('/', bankLink);

module.exports = router;
