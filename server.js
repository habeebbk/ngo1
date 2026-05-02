const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;
const MONGO_URI = "mongodb+srv://habeeb:dqfrt9MRTzPGHrtB@cluster0.fh9s8.mongodb.net/ngo1?appName=Cluster0";

app.use(cors());
app.use(express.json());
app.use(express.static(__dirname));

// MongoDB Connection
mongoose.connect(MONGO_URI)
    .then(() => console.log('Connected to MongoDB Cloud'))
    .catch(err => console.error('MongoDB Connection Error:', err));

// Schema Definition
const recordSchema = new mongoose.Schema({
    fullName: String,
    age: Number,
    gender: String,
    villageOrPanchayat: String,
    wardNumber: String,
    houseNameOrNumber: String,
    occupation: String,
    incomeRange: String,
    educationLevel: String,
    numberOfFamilyMembers: Number,
    timestamp: { type: Date, default: Date.now }
});

const Record = mongoose.model('Record', recordSchema);

// API Endpoints

// Get all records
app.get('/api/data', async (req, res) => {
    try {
        const records = await Record.find().sort({ timestamp: -1 });
        res.json(records);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch data' });
    }
});

// Save record
app.post('/api/data', async (req, res) => {
    try {
        const newRecord = new Record(req.body);
        await newRecord.save();
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: 'Failed to save data' });
    }
});

// Update record
app.put('/api/data/:id', async (req, res) => {
    try {
        const { id } = req.params;
        // Check if ID is a valid MongoDB ObjectId or an index (for backward compatibility during transition)
        if (mongoose.Types.ObjectId.isValid(id)) {
            await Record.findByIdAndUpdate(id, req.body);
        } else {
            // Fallback for old index-based requests during the transition period
            const records = await Record.find().sort({ timestamp: -1 });
            const recordToUpdate = records[id];
            if (recordToUpdate) {
                await Record.findByIdAndUpdate(recordToUpdate._id, req.body);
            }
        }
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: 'Failed to update data' });
    }
});

// Delete record
app.delete('/api/data/:id', async (req, res) => {
    try {
        const { id } = req.params;
        if (mongoose.Types.ObjectId.isValid(id)) {
            await Record.findByIdAndDelete(id);
        } else {
            const records = await Record.find().sort({ timestamp: -1 });
            const recordToDelete = records[id];
            if (recordToDelete) {
                await Record.findByIdAndDelete(recordToDelete._id);
            }
        }
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: 'Failed to delete data' });
    }
});

// Download CSV (Export from MongoDB)
app.get('/api/download', async (req, res) => {
    try {
        const records = await Record.find().lean();
        if (records.length === 0) return res.status(404).send('No data to export');

        const headers = 'fullName,age,gender,villageOrPanchayat,wardNumber,houseNameOrNumber,occupation,incomeRange,educationLevel,numberOfFamilyMembers,timestamp\n';
        const csvRows = records.map(r => [
            r.fullName,
            r.age,
            r.gender,
            r.villageOrPanchayat,
            r.wardNumber,
            r.houseNameOrNumber,
            r.occupation,
            r.incomeRange,
            r.educationLevel,
            r.numberOfFamilyMembers,
            r.timestamp.toISOString()
        ].map(v => String(v).replace(/,/g, ';')).join(',')).join('\n');

        res.header('Content-Type', 'text/csv');
        res.attachment('village_data_export.csv');
        res.send(headers + csvRows);
    } catch (err) {
        res.status(500).send('Export failed');
    }
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
