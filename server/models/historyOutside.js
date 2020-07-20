const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Promise = require('bluebird')

const schema = new mongoose.Schema({
  from: String,
  to: String,
  sender: String,
  receiver: String,
  time: String,
  amount: Number,
  content: String,
  bank: String,
  }, {
  collection: 'outside',
  timestamps: true,
})

schema.set('toJSON', { getters: true });
schema.set('toObject', { getters: true });


module.exports = mongoose.model('Outside', schema);
