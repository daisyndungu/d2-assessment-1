const dotenv = require('dotenv').config();

const prod= {
    DATABASE_URL: process.env.PROD_DATABASE_URL
};

const dev= {
    DATABASE_URL: process.env.DEV_DATABASE_URL
};

const test = {
    DATABASE_URL: process.env.TEST_DATABASE_URL
};

const config ={
    prod,
    dev,
    test
}

module.exports = config;