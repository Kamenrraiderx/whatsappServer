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
                rows.push({...row,activeSend:row.activeSend =='true'}); // Add each row to the array
            })
            .on('end', () => {
                resolve(rows); // Resolve with the filled array after processing
            })
            .on('error', (err) => {
                console.error('Error reading CSV file:', err);
                reject(err); // Reject if there's an error
            });
    });
}

module.exports = csvParser;