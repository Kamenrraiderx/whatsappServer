import { createObjectCsvWriter } from 'csv-writer';
import path  from 'path';

const __dirname = new URL('.', import.meta.url).pathname;
export const writeCsvData = async (data) => {
    const filePath = path.join(__dirname, '..', '..', '..', 'public', 'docs', 'users.csv');
    const csvWriter = createObjectCsvWriter({
        path: filePath,
        header: Object.keys(data[0]).map((key) => ({ id: key, title: key })),
    });
    await csvWriter.writeRecords(data);
};