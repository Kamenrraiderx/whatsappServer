const { createObjectCsvWriter }  = require('csv-writer');
const path  = require('path');

 async function writeCsvData(data) {
    const filePath = path.join(__dirname, '..', '..', '..', 'public', 'docs', 'users.csv');
    const csvWriter = createObjectCsvWriter({
        path: filePath,
        header: Object.keys(data[0]).map((key) => ({ id: key, title: key })),
    });
    await csvWriter.writeRecords(data);
};

module.exports = writeCsvData;