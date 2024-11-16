const express = require('express');
const cron = require('node-cron');
const bodyParser = require('body-parser');
const configCors = require('./config/cors.js');
const csvCRUDRoutes = require('./app/routes/csvCRUD.js');
const loadJobs = require('./app/utils/loadJobs.js');
const clientConnection = require('./app/connection/whatsappClient.js');

const app = express();
const port = 3000;
const scheduledJobs = new Map();
console.log('Hola')
// Define una función asincrónica para inicializar la aplicación
async function startApp() {
    // Espera la conexión con WhatsApp (clientConnection es asincrónica)
    let client = await clientConnection();

    // Usa el cliente en tu aplicación
    app.use((req, res, next) => {
        req.scheduledJobs = scheduledJobs;
        req.client = client;
        next();
    });

    app.use(configCors);
    app.use(express.static('./public'));
    app.use(bodyParser.urlencoded({ extended: true }));
    app.use(bodyParser.json());
    app.use(express.json());
    app.set('view engine', 'ejs');

    app.use('/v1', csvCRUDRoutes);
    app.use(express.static('./public'));

    loadJobs(scheduledJobs, client);

    // Configura un trabajo cron para resetear los trabajos el primer día de cada mes
    cron.schedule('0 0 1 * *', async () => {
        console.log('Resetting jobs on the first of the month');
        await loadJobs(scheduledJobs); // Puedes usar await aquí también
    });

    // Inicia el servidor Express
    app.listen(port, () => {
        console.log(`Server running at http://localhost:${port}`);
    });
}

// Llama a la función asincrónica
startApp().catch((err) => {
    console.error('Error starting the app:', err);
});
