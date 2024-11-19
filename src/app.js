const express = require('express');
const cron = require('node-cron');
const bodyParser = require('body-parser');
const configCors = require('./config/cors.js');
const csvCRUDRoutes = require('./app/routes/csvCRUD.js');
const testRoutes = require('./app/routes/testRoutes.js');
const cors = require('cors');
const loadJobs = require('./app/utils/loadJobs.js');
const clientConnection = require('./app/connection/whatsappClient.js');
const csvParser = require('./app/utils/csv-parser.js');
const writeCsvData = require('./app/utils/writeCsvData.js');
require('dotenv').config();
const app = express();
const port = process.env.PORT || 4000;
const scheduledJobs = new Map();
// Define una función asincrónica para inicializar la aplicación
async function startApp() {
    // Espera la conexión con WhatsApp (clientConnection es asincrónica)
    let client = await clientConnection();

    // Usa el cliente en tu aplicación
    app.use((req, res, next) => {
        req.scheduledJobs = scheduledJobs;
        req.client = client;
        res.setHeader(
            "Content-Security-Policy",
            "default-src *; img-src *; script-src 'self'; style-src 'self';"
        );
        next();
    });

    app.use(cors({
        origin:'https://ena-trasportes.vercel.app'
    }));
    app.use(express.static('./public'));
    app.use(bodyParser.urlencoded({ extended: true }));
    app.use(bodyParser.json());
    app.use(express.json());
    app.set('view engine', 'ejs');

    app.use('/v1', csvCRUDRoutes);
    app.use('/v1', testRoutes);
    app.use(express.static('./public'));

    loadJobs(scheduledJobs, client);

    cron.schedule('0 0 2 * *', async () => {
        let users = await csvParser(); // Obtener los usuarios desde el archivo CSV
        const chatId = `${'50433680080'}@c.us`; // El ID del chat para enviar el mensaje

        // Filtrar a los usuarios que aún deben y que tienen recargo
        const overdueUsers = users.filter(user => user.activeSend);

        // Construir la sección del mensaje con los usuarios deudores
        let overdueMessage = overdueUsers.map((user, index) => {
            return `
${index + 1}️⃣  *${user.Name}*  
    
    - Monto adeudado: 
        ${'user.montoAdeudado'}  
    
    - Fecha límite de pago:
        ${'user.fechaLimite'}  
    
    - Recargo:
        ${'user.recargo'}
            `;
        }).join('\n'); // Unir todos los usuarios en una cadena separada por saltos de línea

        // Si no hay usuarios pendientes, enviar un mensaje alternativo
        if (overdueMessage === '') {
            overdueMessage = 'No hay usuarios con pagos pendientes.';
        }

        // Componer el mensaje completo
        let message = `📢 *Resumen de Pagos del Mes - Transporte Escolar* 🚌
    
Aquí tiene el resumen de los pagos pendientes de transporte escolar para este mes, con los usuarios que aún no han realizado su pago y deben un recargo adicional:
    
🔴 *Contactos Pendientes de Pago con Recargo:*
        
${overdueMessage}
    
💡 *Importante:* Estos usuarios no han pagado a tiempo, por lo que se les ha aplicado un recargo adicional. Le sugerimos realizar un seguimiento con ellos para regularizar los pagos.
    `;

        // Enviar el mensaje
        client.sendMessage(chatId, message)
            .then((response) => {
                console.log(`Resumen enviado a ${chatId}`);
            }).catch(err => {
                console.error(`Error enviando el resumen a ${chatId}:`, err);
            });

        // Marcar usuarios como enviados y guardar los datos
        users.map(user => user.activeSend = true);
        await writeCsvData(users);

        // Cargar los trabajos programados
        console.log('Reiniciando trabajos');
        await loadJobs(scheduledJobs); // Puedes usar await aquí también

    });




    // Inicia el servidor Express
    app.listen(port, '0.0.0.0', () => {
        console.log(`Server running at http://0.0.0.0:${port}`);
    });
}

// Llama a la función asincrónica
startApp().catch((err) => {
    console.error('Error starting the app:', err);
});
