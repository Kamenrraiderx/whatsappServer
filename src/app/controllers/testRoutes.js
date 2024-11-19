const csvParser = require("../utils/csv-parser.js");
const getLastDayOfMonth = require("../utils/lastDay.js");
const path = require('path');
const pkg = require('whatsapp-web.js');
const fs = require('fs');
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

const limitDate = getCustomDayOfMonth(40)
const finalDate = getCustomDayOfMonth(5)
const lastDay = getLastDayOfMonth()
const filePath = path.join(__dirname, '..', '..', '..', 'public', 'images', 'bus.jpg');
let mesages = {
    'notice': {
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
    'warning': {
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
    'surcharge': {
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

    }
}

const sendWarning = async (req, res) => {
    try {
        let users = await csvParser();
        users.map(user => {
            const { Phone, Name, activeSend } = user;
            const chatId = `${Phone}@c.us`;
            if (activeSend) {
                const base64Image = fs.readFileSync(mesages.warning.image, { encoding: 'base64' });
                const media = new MessageMedia('image/png', base64Image);
                req.client.sendMessage(chatId, media, { caption: mesages.warning.message })
                    .then((response) => {
                        console.log(`Message sent to ${Name}:`);
                    }).catch(err => {
                        console.error(`Error sending message to ${Name}:`, err);
                    });

            }

        })
        res.json({ message: 'Mensaje enviado!' });
    } catch (err) {
        res.status(500).json({ error: 'Error enviando mensaje' });
        console.log(err)
    }
}
const sendNotice = async (req, res) => {
    try {
        let users = await csvParser();
        users.map(user => {
            const { Phone, Name, activeSend } = user;
            const chatId = `${Phone}@c.us`;
            if (activeSend) {
                const base64Image = fs.readFileSync(mesages.notice.image, { encoding: 'base64' });
                const media = new MessageMedia('image/png', base64Image);
                req.client.sendMessage(chatId, media, { caption: mesages.notice.message })
                    .then((response) => {
                        console.log(`Message sent to ${Name}:`);
                    }).catch(err => {
                        console.error(`Error sending message to ${Name}:`, err);
                    });

            }

        })
        res.json({ message: 'Mensaje enviado!' });
    } catch (err) {
        res.status(500).json({ error: 'Error enviando mensaje' });
        console.log(err)
    }
}
const sendSurcharge = async (req, res) => {
    try {
        let users = await csvParser();
        users.map(user => {
            const { Phone, Name, activeSend } = user;
            const chatId = `${Phone}@c.us`;
            if (activeSend) {
                const base64Image = fs.readFileSync(mesages.surcharge.image, { encoding: 'base64' });
                const media = new MessageMedia('image/png', base64Image);
                req.client.sendMessage(chatId, media, { caption: mesages.surcharge.message })
                    .then((response) => {
                        console.log(`Message sent to ${Name}:`);
                    }).catch(err => {
                        console.error(`Error sending message to ${Name}:`, err);
                    });

            }

        })
        res.json({ message: 'Mensaje enviado!' });
    } catch (err) {
        res.status(500).json({ error: 'Error enviando mensaje' });
        console.log(err)
    }
}


const sendResume = async (req, res) => {
    try {
        let users = await csvParser();
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

        const chatId = `${'50433680080'}@c.us`;

        req.client.sendMessage(chatId, message)
            .then((response) => {
                console.log(`Mensaje enviado!`);
            }).catch(err => {
                console.error(`Error al enviar el mensaje`, err);
            });


        res.json({ message: 'Mensaje enviado!' });
    } catch (err) {
        res.status(500).json({ error: 'Error enviando mensaje' });
        console.log(err)
    }
}

module.exports = {
    sendWarning,
    sendNotice,
    sendSurcharge,
    sendResume
}