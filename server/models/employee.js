const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Promise = require('bluebird')

const sellerSchema = new Schema({
  user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      unique: true
  },
  timeOff: {
      type: Boolean,
      default: false
  },
  dateStartString: String,
  dateExpireString: String,
  fromNow: String,
  sellerExpires: Date
}, { timestamps: true})

const Seller = mongoose.model('Seller', sellerSchema);
module.exports = { Seller }
