const express = require('express');
const router = express.Router();
const moment = require('moment');
const transactionModel = require('../../models/transaction');
const utils = require('../../utils/utils');

router.get('/', utils.requireRole('employee'),  async(req,res)=>{
    const list = await transactionModel.all();

    res.json(list);
})



module.exports = router;