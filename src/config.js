module.exports = {
  PORT: process.env.PORT || 8000,
  NODE_ENV: process.env.NODE_ENV || 'development',
  DATABASE_URL: process.env.DATABASE_URL|| DATABASE_URL ,
  API_TOKEN: process.env.API_TOKEN ,
  JWT_SECRET: process.env.JWT_SECRET || 'grocery-list-api-jwt',
  JWT_EXPIRY: process.env.JWT_EXPIRY || '3h',
  TEST_DATABASE_URL: process.env.TEST_DATABASE_URL|| this.TEST_DATABASE_URL,
  CLIENT_ORIGIN: process.env.CLIENT_ORIGIN

}

