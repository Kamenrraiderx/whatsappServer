const { csvParser } = require("../utils/csv-parser");
const loadJobs = require("../utils/loadJobs");
const { writeCsvData } = require("../utils/writeCsvData");

const deleteUser = async (req, res) => {
    try {
        const { Phone,sendDate } = req.body;  // Identify user by Phone
        const jobKey = `${Phone}-${sendDate}`;
        req.scheduledJobs.get(jobKey).stop();
        req.scheduledJobs.delete(jobKey);
        let users = await csvParser();
        const initialLength = users.length;
        // Filter out the user with the specified phone number
        users = users.filter(user => user.Phone !== Phone && user.sendDate !== sendDate);

        if (users.length === initialLength) {
            return res.status(404).json({ error: 'User not found.' });
        }

        await writeCsvData(users);
        res.json({ message: 'Row deleted successfully!' });
    } catch (err) {
        res.status(500).json({ error: 'Failed to delete row.' });
        console.log(err)
    }
};

// Route to add a new row
const addUser = async (req, res) => {
    try {
        let users = await csvParser();
        users.push(req.body);  // Add new user data from request body
        await writeCsvData(users);
        loadJobs(req.scheduledJobs,req.client)
        res.json({ message: 'Row added successfully!' });
    } catch (err) {
        res.status(500).json({ error: 'Failed to add row.' });
        console.log(err)
    }
};

const getUsers = async (req, res) => {
    try {
        let users = await csvParser();
        res.json({ message: users });
    } catch (err) {
        console.log(err)
        res.status(500).json({ error: 'Failed to send users.' });
    }
};



const updateUser = async (req, res) => {
    try {
        const { ID, ...updatedData } = req.body;  // Identify user by Phone
        const users = await csvParser();
        const userIndex = users.findIndex(user => user.Phone === ID);

        if (userIndex === -1) return res.status(404).json({ error: 'User not found.' });

        users[userIndex] = { ...users[userIndex], ...updatedData };  // Update user data
        await writeCsvData(users);
        loadJobs(req.scheduledJobs,req.client)
        res.json({ message: 'Row updated successfully!' });
    } catch (err) {
        res.status(500).json({ error: 'Failed to update row.' });
    }
};

module.exports = {
    deleteUser,
    addUser,
    getUsers,
    updateUser

};