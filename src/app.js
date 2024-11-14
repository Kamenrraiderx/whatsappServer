import express from 'express';
import cron from 'node-cron';
import bodyParser from 'body-parser';
import configCors from './config/cors.js';
import csvCRUDRoutes from './app/routes/csvCRUD.js'
import loadJobs from './app/utils/loadJobs.js';
import clientConnection from './app/connection/whatsappClient.js';

const app = express();
const port = 4000;
const scheduledJobs = new Map();
let client = await clientConnection()

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



loadJobs(scheduledJobs,client); 

// Schedule a cron job to reset jobs on the first of every month at midnight
cron.schedule('0 0 1 * *', async () => {
    console.log('Resetting jobs on the first of the month');
    await loadJobs(scheduledJobs);
});


// Start Express server to handle routes (for example, triggering message sending)
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
