const database = require('./db');
database.connect();
const express = require('express');
const bodyParser = require('body-parser');

const dotenv = require('dotenv');
dotenv.config();

const app = express();
app.use(bodyParser.json());

const userRoute = require('./src/routes/user');
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*"); // update to match the domain you will make the request from
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
  });

app.use(userRoute);

app.use((req, res, next) => {
    console.log(`${new Date().toString()} => ${req.originalUrl}`, req.body);
    next();
});

// Controlador para los errores 404 - Recurso no encontrado
app.use((req, res, next) => {
    res.status(404).send('Error 404 - Recurso no encontrado. ¿Te has perdido amigo?');
});
//Controlador para los errores 500 - Fallo del servidor
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(404).send('Error 500 - Fallo del servidor. Lo sentimos.');
});

module.exports = app;