console.log("Lanzando servidor de API de perfil...");

const app = require('../server.js');
const PORT = process.env.PORT || 3005;

app.listen(PORT, () => console.info(`Servidor en funcionamiento en el puerto ${PORT}`));