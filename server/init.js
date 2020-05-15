const mongoose = require('mongoose');

const mongodb = "mongodb://finalproject:k16hcmus@ds363088.mlab.com:63088/ib";
const mongoOptions = {
  useCreateIndex: true,
  useNewUrlParser: true,
  poolSize: 50,
  keepAlive: 1,
  connectTimeoutMS: 60 * 60 * 1000,
  socketTimeoutMS: 60 * 60 * 1000,
  useUnifiedTopology: true
};

require('./models');

mongoose.connect(mongodb, mongoOptions);

mongoose.connection.on('error', (err) => {
  console.error(err);
});

mongoose.connection.on('disconnected', () => {
  setTimeout(() => {
    mongoose.connect(envConf.mongodb, mongoOptions);
  }, 5000);
});

mongoose.set('debug', (collectionName, method, query, docs) => {
  console.debug(`Mongoose: db.${collectionName}.${method}(${JSON.stringify(query)}) ${JSON.stringify(docs)}`);
});

module.exports = {};
