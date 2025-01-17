const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Promise = require('bluebird')

const schema = new mongoose.Schema({
  user_id: String,
  name: String,
  code: String,
  phone: String,
  address: String,
  role: 
    {
      type: String,
      default: 'nhanvien',
      emum: [
        'giaodichvien',
        'tindung',
        'nhanvien'
      ]
    }
  }, {
  collection: 'employee',
  timestamps: true,
})

schema.set('toJSON', { getters: true });
schema.set('toObject', { getters: true });


module.exports = mongoose.model('Employee', schema);
