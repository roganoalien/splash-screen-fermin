require('dotenv').config();

const config = {
    dbName: process.env.DATABASE_NAME,
    localport: process.env.LOCALHOST_PORT,
    secret: process.env.SECRET_WORD
};

module.exports = { config };
