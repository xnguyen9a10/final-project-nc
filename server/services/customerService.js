const mongoose = require('mongoose');
const Customer = mongoose.model('Customer');

class CustomerService {
  static async vidu() {
    //xu ly database cac kieu o day
    return Promise.resolve("day la vidu!")
  }
}

module.exports = CustomerService