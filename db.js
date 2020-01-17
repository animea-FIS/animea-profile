const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();
const DB_SERVER = process.env.DB_SERVER;
const DB_DATABASE = process.env.DB_DATABASE;
const DB_USER = process.env.DB_USER;
const DB_PASSWORD = process.env.DB_PASSWORD;

const SERVER = DB_SERVER;
const DATABASE = DB_DATABASE;
const USER = DB_USER;
const PASSWORD = DB_PASSWORD
const OPTIONS = 'retryWrites=true&w=majority';

function connect() {
  mongoose.connect(`mongodb+srv://${USER}:${PASSWORD}@${SERVER}/${DATABASE}?${OPTIONS}`,
    {useNewUrlParser: true, useUnifiedTopology: true});

  mongoose.connection.on('error', console.error.bind(console, 'connection error:'));
  /*mongoose.connection.once('open', function() {
    console.log('Database connection OK');
  });*/
}

module.exports.connect = connect;