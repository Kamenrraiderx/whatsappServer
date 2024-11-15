import csvParser from "./csv-parser.js";
import cron from 'node-cron';
import convertToCronFormat from "./dateConvert.js";
import path from 'path';
import pkg from 'whatsapp-web.js';
import fs from 'fs';
const { MessageMedia } = pkg;
export default async function loadJobs(scheduledJobs, client) {
    try {
        const __dirname = new URL('.', import.meta.url).pathname;
        const filePath = path.join(__dirname, '..', '..', '..', 'public', 'images', 'bus.jpg');
        console.log("prueba 1")

        console.log("prueba 1.1")
        // Clear all existing jobs
        scheduledJobs.forEach(job => job.stop());
        scheduledJobs.clear();

        // Load users from the CSV
        let users = await csvParser();
        console.log('usuarios:', users)
        console.log("prueba 2")
        users.forEach(user => {
            console.log("prueba 3")
            const { Phone, Name, sendDate, activeSend, id } = user;
            const chatId = `${Phone}@c.us`;
            const jobKey = `${id}`;
            // Only schedule job if sendMessage is true
            if (activeSend) {
                const job = cron.schedule(convertToCronFormat(sendDate), () => {
                    // const message = `Hello ${Name}, this is your scheduled message!`;
                    // client.sendMessage(chatId, message)
                    //     .then(response => {
                    //         console.log(`Message sent to ${Name}:`, response);
                    //     })
                    //     .catch(err => {
                    //         console.error(`Error sending message to ${Name}:`, err);
                    //     });


                    client.sendMessage(chatId, '¡Hola! Te recordamos el cobro del servicio este mes.')
                        .then(() => {
                            const base64Image = fs.readFileSync(filePath, { encoding: 'base64' });
                            client.sendMessage(chatId, 'Aquí tienes más información sobre tu cobro:');
                            const media = new MessageMedia('image/png', base64Image);
                            client.sendMessage(chatId, media, { caption: 'Imagen del cobro' });

                            // Enviar audio con mensaje
                            //client.sendMessage(chatId, audioUrl, { sendAudioAsVoice: true });
                        });

                    
                });

                scheduledJobs.set(jobKey, job); // Save each job with a unique key
                console.log(`Scheduled message for ${Name} at ${sendDate}`);
            }
        });
        console.log(scheduledJobs)
    } catch (err) {
        console.log(err)
    }

};

