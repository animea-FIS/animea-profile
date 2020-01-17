const database = require('./db');
database.connect();
const express = require('express');
const bodyParser = require('body-parser');

const dotenv = require('dotenv');
dotenv.config();

const app = express();
const expressSwagger = require('express-swagger-generator')(app);
const API_PATH = process.env.API_PATH;

let options = {
    swaggerDefinition: {
        info: {
            description: 'Animea profile microservice',
            title: 'Swagger',
            version: '1.0.0',
        },
        host: 'https://animea-profile.herokuapp.com',
        basePath: API_PATH,
        produces: [
            "application/json",
            "application/xml"
        ],
        schemes: ['http', 'https'],
        securityDefinitions: {
            JWT: {
                type: 'apiKey',
                in: 'header',
                name: 'Authorization',
                description: "",
            }
        }
    },
    basedir: __dirname, //app absolute path
    files: ['./src/routes/*.js'] //Path to the API handle folder
};
expressSwagger(options)

app.use(bodyParser.json());

const userRoute = require('./src/routes/user');

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*"); // update to match the domain you will make the request from
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header("Access-Control-Allow-Methods", 'GET, POST, OPTIONS, PUT, DELETE');
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