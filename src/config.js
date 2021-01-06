module.exports = {
  PORT: process.env.PORT || 8000,
  NODE_ENV: process.env.NODE_ENV || 'development',
  DATABASE_URL: process.env.DATABASE_URL || "postgresql://dunder_mifflin@localhost/grocery",
  API_TOKEN: process.env.API_TOKEN || '5271f4f2-40cb-41be-adea-f38ae8395cc2',
  JWT_SECRET: process.env.JWT_SECRET || 'grocery-list-api-jwt',
  JWT_EXPIRY: process.env.JWT_EXPIRY || '3h',
  TEST_DATABASE_URL: process.env.TEST_DATABASE_URL || "postgresql://dunder_mifflin@localhost/grocery_test"
  
}

//https://dry-lowlands-85202.herokuapp.com
//Created postgresql-rectangular-32574 as HEROKU_POSTGRESQL_AQUA_URL