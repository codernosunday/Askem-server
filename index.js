const app = require("./app");
const mongoose = require("mongoose");
const config = require("./config");
require('dotenv').config
const connect = url => {
  return mongoose.connect(url, config.db.options);
};

if (require.main === module) {
  if (process.env.ENVIROMENT === 'deloyment') {
    app.listen(process.env.PORT);
  }
  else {
    app.listen(config.port);
  }
  connect(config.db.prod);
  mongoose.connection.on('error', console.log);
}

module.exports = { connect };

