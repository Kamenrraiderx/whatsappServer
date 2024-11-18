const csvParser = require("./csv-parser.js");
const cron = require('node-cron');
const convertToCronFormat = require("./dateConvert.js");
const path = require('path');
const pkg = require('whatsapp-web.js');
const fs = require('fs');
const getLastDayOfMonth = require("./lastDay.js");
const { MessageMedia } = pkg;



function getCustomDayOfMonth(day = 5) {
    const now = new Date();
    const lastDayOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();

    // Si el día es mayor al último día del mes, ajustar al último día del mes
    const validDay = day > lastDayOfMonth ? lastDayOfMonth : day;

    const customDate = new Date(now.getFullYear(), now.getMonth(), validDay);

    return customDate.toLocaleDateString('es-ES', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
    });
}

async function loadJobs(scheduledJobs, client) {
    try {
        const filePath = path.join(__dirname, '..', '..', '..', 'public', 'images', 'bus.jpg');
        // Clear all existing jobs
        scheduledJobs.forEach(job => job.stop());
        scheduledJobs.clear();
        const limitDate = getCustomDayOfMonth(40)
        const finalDate = getCustomDayOfMonth(5)
        const lastDay = getLastDayOfMonth()
        // Load users from the CSV
        let users = await csvParser();

        let mesages = [
            {
                message: `📢 *¡Atención!*
Estimado usuario, queremos recordarle que se aproxima la fecha límite para realizar el pago del *transporte escolar* correspondiente al mes. 🚌

🗓 *Fecha límite:* ${limitDate}
💡 Le invitamos a realizar el pago antes de esta fecha para evitar recargos.

Puede realizar el pago mediante:
1️⃣ Transferencia bancaria: [datos de cuenta]
2️⃣ Pago en efectivo: [punto de pago autorizado]

Gracias por su puntualidad. 😊

💡 *Tip:* Guarde este mensaje o configure un recordatorio en su calendario. Si necesita más información, no dude en escribirnos.    
                    `,
                date: '0 8 25 * *',
                image: filePath

            },
            {
                message: `⚠️ *¡Hoy es el último día!*

Estimado usuario, le recordamos que hoy, ${limitDate}, es el último día para realizar el pago del *transporte escolar* sin recargos. 🚌

💳 Asegúrese de realizar su pago antes del final del día para evitar costos adicionales.

📌 Métodos de pago:

Transferencia: [datos bancarios]
Pago presencial: [ubicación autorizada]

Cualquier consulta, estamos aquí para ayudarle. 😊

💡 *Sugerencia:* Puede enviar el comprobante de pago por WhatsApp para confirmar su registro.   
                    `,
                date: `0 8 ${lastDay} * *`,
                image: filePath

            },
            {
                message: `📢 *Información importante sobre el pago*

Estimado usuario, le informamos que, al no realizar el pago del *transporte escolar* en tiempo y forma, ahora su cuota incluye un recargo adicional. 🚌

🔴 *Monto del recargo:* L 100.00
📅 *Fecha límite para regularizar:* ${finalDate}

🔗 Métodos de pago disponibles:
1️⃣ Transferencia bancaria: [datos bancarios]
2️⃣ Pago presencial: [dirección]

Gracias por su comprensión y atención. Si tiene dudas, estamos a su disposición para ayudarle. 😊    
`,
                date: '0 8 1 * *',
                image: filePath

            }]
        users.forEach(user => {
            const { Phone, Name, activeSend, id } = user;
            const chatId = `${Phone}@c.us`;

            // Only schedule job if sendMessage is true
            if (activeSend) {
                mesages.forEach(message => {
                    const jobKey = `${id}-${message.date}`;
                    const job = cron.schedule(message.date, () => {
                        const base64Image = fs.readFileSync(message.image, { encoding: 'base64' });
                        const media = new MessageMedia('image/png', base64Image);
                        client.sendMessage(chatId, media, { caption: message.message })
                            .then((response) => {
                                console.log(`Message sent to ${Name}:`, response);
                            }).catch(err => {
                                console.error(`Error sending message to ${Name}:`, err);
                            });
                    });
                    scheduledJobs.set(jobKey, job); // Save each job with a unique key
                    console.log(`Scheduled message for ${Name} at ${message.date}`);
                })
            }
        });
    } catch (err) {
        console.log(err)
    }

};
module.exports = loadJobs;
