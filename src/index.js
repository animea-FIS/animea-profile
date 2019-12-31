console.log("Lanzando servidor de API de perfil...");

// Montamos la aplicación de express
//const express = require('express');
//const app = express();

// Le decimos que convierta correctamente los objetos JSON
//const bodyParser = require('body-parser');
//app.use(bodyParser.json());

// Conectamos la Base de datos, definida en /db.js
//const database = require('../db');
//database.connect();

// Configuramos y añadimos las variables de entorno definidas en el fichero /.env
//const dotenv = require('dotenv');
//dotenv.config();

// Añadimos los ficheros que controlarán las rutas
//const userRoute = require('./routes/user');
/*app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*"); // update to match the domain you will make the request from
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
  });*/

//app.use(userRoute);

// Middleware que mostrará logs de cada llamada
/*app.use((req, res, next) => {
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
});*/

// Establecemos el puerto donde escuchará la aplicación

const app = require('../server.js');
const PORT = process.env.PORT || 3002;

app.listen(PORT, () => console.info(`Servidor en funcionamiento en el puerto ${PORT}`));