const mongoose = require('mongoose');

const SERVER = 'animea-profile-mqhbz.mongodb.net';
const DATABASE = 'animea-profile';
const USER = 'animea';
const PASSWORD = 'animea';
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