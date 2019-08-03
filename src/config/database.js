const { config } = require('./config-app'),
    CONNECTION_URI =
        process.env.MONGODB_URI || `mongodb://localhost/${config.dbName}`,
    mongoose = require('mongoose');

mongoose
    .connect(CONNECTION_URI, {
        useNewUrlParser: true,
        useCreateIndex: true,
        useFindAndModify: false
    })
    .then(db => console.log(`Conectado a la BD: ${config.dbName}`))
    .catch(err => console.log(err));
