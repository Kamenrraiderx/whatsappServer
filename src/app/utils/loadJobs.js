const { csvParser } = require("./csv-parser");
const cron = require('node-cron');
const convertToCronFormat = require("./dateConvert");
const loadJobs = async (scheduledJobs,client) => {
    try {
        console.log("prueba 1")
        
        console.log("prueba 1.1")
        // Clear all existing jobs
        scheduledJobs.forEach(job => job.stop());
        scheduledJobs.clear();

        // Load users from the CSV
        let users = await csvParser();
        console.log("prueba 2")
        users.forEach(user => {
            console.log("prueba 3")
            const { Phone, Name, sendDate, sendMessage } = user;
            const chatId = `${Phone}@c.us`;
            const jobKey = `${Phone}-${sendDate}`;
            // Only schedule job if sendMessage is true
            if (sendMessage) {
                const job = cron.schedule(convertToCronFormat(sendDate) , () => {
                    const message = `Hello ${Name}, this is your scheduled message!`;
                    client.sendMessage(chatId, message)
                        .then(response => {
                            console.log(`Message sent to ${Name}:`, response);
                        })
                        .catch(err => {
                            console.error(`Error sending message to ${Name}:`, err);
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

module.exports = loadJobs;