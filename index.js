console.log("----Index.js file----")
console.log("Startinig API server...")

var express = require('express')

var port = 3000;
var app = express();

app.get("/", (req, res) => {
    res.send("Servidor corriendo");
});

app.listen(port);

console.log("Servidor listo");