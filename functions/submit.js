const express = require('express');
const serverless = require('serverless-http');
const bodyParser = require('body-parser');
const multer = require('multer');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
require('dotenv').config();

const app = express();
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, '../public')));
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

const storage = multer.diskStorage({
    destination: './uploads/',
    filename: (req, file, cb) => {
        cb(null, `${req.body.affiliationNumber}_${file.originalname}`);
    }
});
const upload = multer({ storage });

app.post('/submit/trainees', upload.single('cardPic'), (req, res) => {
    const db = new sqlite3.Database(path.resolve(__dirname, '../trainees.db'));

    const { fullName, age, gender, placeOfBirth, affiliationNumber, number } = req.body;
    const cardPicUrl = `/uploads/${req.file.filename}`;

    db.run(`INSERT INTO trainees (full_name, age, gender, place_of_birth, affiliation_number, number, card_pic_url)
            VALUES (?, ?, ?, ?, ?, ?, ?)`, [fullName, age, gender, placeOfBirth, affiliationNumber, number, cardPicUrl], (err) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.status(201).json({ message: 'Trainee info submitted successfully!' });
    });

    db.close();
});

module.exports.handler = serverless(app);
