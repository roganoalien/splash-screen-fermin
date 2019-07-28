const { config } = require('./config-app'),
    mongoose = require('mongoose');

mongoose
    .connect(`mongodb://localhost/${config.dbName}`, {
        useNewUrlParser: true,
        useCreateIndex: true,
        useFindAndModify: false
    })
    .then(db => console.log(`Conectado a la BD: ${config.dbName}`))
    .catch(err => console.log(err));
