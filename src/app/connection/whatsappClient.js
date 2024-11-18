const pkg = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const path = require('path');
const { Client, LocalAuth } = pkg;

async function clientConnection() {
    const dataSession = path.join(__dirname, 'session');

    const client = new Client({
        authStrategy: new LocalAuth({
            dataPath: dataSession,
        }),
        puppeteer: {
            headless: true,
            args: ['--no-sandbox', '--disable-setuid-sandbox'],
        },
    });

    return new Promise((resolve, reject) => {
        client.on('ready', () => {
            console.log('Cliente de WhatsApp listo.');
            resolve(client);  // Resuelve la promesa cuando el cliente está listo
        });

        client.on('auth_failure', msg => {
            console.error('Fallo de autenticación:', msg);
            reject(new Error('Fallo de autenticación: ' + msg));  // Rechaza la promesa en caso de fallo
        });

        client.on('qr', qr => {
            console.log('Escanea el código QR para iniciar sesión.');
            qrcode.generate(qr, { small: true });
        });

        client.on('message', async (message) => {
            if (message.body === 'Ver detalles') {
              await client.sendMessage(message.from, 'Aquí están los detalles de tu cobro...');
            }
        });
        client.on('message_create', message => {
            //console.log(message.body);
        
            if (message.body === '!ping') {
                message.reply('pong');
            }
        });
        client.initialize();
    });
}

module.exports = clientConnection;
