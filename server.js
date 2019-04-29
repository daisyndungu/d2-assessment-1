const express = require('express');
const bodyParser = require('body-parser');
const logger = require('morgan');
const mongoose = require('mongoose');

const config = require('./config/config');
const routes = require('./src/routes/routes');

const app = express();
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
// identify environment
const env = process.env.NODE_ENV;
// establish db connection
mongoose.connect(
    config[env].DATABASE_URL,
    { useCreateIndex: true,
    useNewUrlParser: true });
const db = mongoose.connection;
const port = process.env.PORT || 8000;

db.on('error',function(){
    console.log('Failed to connect to the DB');
});
db.once('open',function(){
    app.listen(port);
    console.log('DB Connection Established!');
});

app.use('/api/v1', routes);

module.exports = app
    