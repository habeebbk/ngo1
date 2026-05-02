const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;
const CSV_FILE = path.join(__dirname, 'records.csv');

app.use(cors());
app.use(express.json());
app.use(express.static(__dirname));

// Ensure CSV exists with headers
if (!fs.existsSync(CSV_FILE)) {
    const headers = 'fullName,age,gender,villageOrPanchayat,wardNumber,houseNameOrNumber,occupation,incomeRange,educationLevel,numberOfFamilyMembers,timestamp\n';
    fs.writeFileSync(CSV_FILE, headers);
}

// Get all records (parsing CSV)
app.get('/api/data', (req, res) => {
    try {
        const content = fs.readFileSync(CSV_FILE, 'utf8');
        const lines = content.trim().split('\n');
        const headers = lines[0].split(',');
        const records = lines.slice(1).map(line => {
            const values = line.split(',');
            const obj = {};
            headers.forEach((header, i) => {
                obj[header] = values[i];
            });
            return obj;
        });
        res.json(records);
    } catch (err) {
        res.status(500).json({ error: 'Failed to read data' });
    }
});

// Save record (Append to CSV)
app.post('/api/data', (req, res) => {
    const data = req.body;
    const values = [
        data.fullName,
        data.age,
        data.gender,
        data.villageOrPanchayat,
        data.wardNumber,
        data.houseNameOrNumber,
        data.occupation,
        data.incomeRange,
        data.educationLevel,
        data.numberOfFamilyMembers,
        new Date().toISOString()
    ];

    // Simple CSV escaping (replace commas with semicolons)
    const csvLine = values.map(v => String(v).replace(/,/g, ';')).join(',') + '\n';

    fs.appendFileSync(CSV_FILE, csvLine);
    res.json({ success: true });
});

// Update record (Rewrite CSV) - Simple implementation
app.put('/api/data/:index', (req, res) => {
    const index = parseInt(req.params.index);
    const newData = req.body;
    
    const content = fs.readFileSync(CSV_FILE, 'utf8');
    const lines = content.trim().split('\n');
    const headers = lines[0];
    let records = lines.slice(1);

    if (index >= 0 && index < records.length) {
        const values = [
            newData.fullName,
            newData.age,
            newData.gender,
            newData.villageOrPanchayat,
            newData.wardNumber,
            newData.houseNameOrNumber,
            newData.occupation,
            newData.incomeRange,
            newData.educationLevel,
            newData.numberOfFamilyMembers,
            new Date().toISOString()
        ];
        records[index] = values.map(v => String(v).replace(/,/g, ';')).join(',');
        
        const newContent = headers + '\n' + records.join('\n') + '\n';
        fs.writeFileSync(CSV_FILE, newContent);
        res.json({ success: true });
    } else {
        res.status(404).json({ error: 'Record not found' });
    }
});

// Delete record
app.delete('/api/data/:index', (req, res) => {
    const index = parseInt(req.params.index);
    
    const content = fs.readFileSync(CSV_FILE, 'utf8');
    const lines = content.trim().split('\n');
    const headers = lines[0];
    let records = lines.slice(1);

    if (index >= 0 && index < records.length) {
        records.splice(index, 1);
        const newContent = headers + '\n' + records.join('\n') + '\n';
        fs.writeFileSync(CSV_FILE, newContent);
        res.json({ success: true });
    } else {
        res.status(404).json({ error: 'Record not found' });
    }
});

// Download CSV
app.get('/api/download', (req, res) => {
    res.download(CSV_FILE, 'village_data_export.csv');
});

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
    console.log(`CSV file being updated at: ${CSV_FILE}`);
});
