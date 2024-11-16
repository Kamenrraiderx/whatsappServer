const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');

async function  csvParser(){
    return new Promise((resolve, reject) => {
        const filePath = path.join(__dirname, '..', '..', '..', 'public', 'docs', 'users.csv');
        const rows = [];

        fs.createReadStream(filePath)
            .pipe(csv())
            .on('data', (row) => {
                console.log("Active send parse:",row.activeSend =='true')
                console.log("Active no parse",row.activeSend =='true')
                rows.push({...row,activeSend:row.activeSend =='true'}); // Add each row to the array
            })
            .on('end', () => {
                console.log('CSV file successfully processed');
                resolve(rows); // Resolve with the filled array after processing
            })
            .on('error', (err) => {
                console.error('Error reading CSV file:', err);
                reject(err); // Reject if there's an error
            });
    });
}

module.exports = csvParser;