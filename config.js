
module.exports = {
  port: process.env.APP_PORT,
  db: {
    prod: process.env.DATABASE_URL,
    test: 'mongodb://localhost/askem-db-test',
    options: {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
      useCreateIndex: true
    }
  },
  jwt: {
    secret: process.env.JWT_SECRET || 'development_secret',
    expiry: '7d'
  }
};
