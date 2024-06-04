const express = require('express');
const router = express.Router();
const sqlite3 = require('sqlite3').verbose();
const multer = require('multer');
const path = require('path');

const db = new sqlite3.Database('trainees.db');

// Multer configuration for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/uploads');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname);
    }
});
const upload = multer({ storage: storage });

// Serve submit.html on the root URL
router.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../views/submit.html'));
});

router.post('/submit', upload.single('cardPic'), (req, res) => {
    const { fullName, age, gender, placeOfBirth, affiliationNumber, number } = req.body;
    const cardPic = req.file ? req.file.filename : null;

    const sql = `INSERT INTO trainees (fullName, age, gender, placeOfBirth, affiliationNumber, number, cardPic) VALUES (?, ?, ?, ?, ?, ?, ?)`;
    const params = [fullName, age, gender, placeOfBirth, affiliationNumber, number, cardPic];

    db.run(sql, params, function(err) {
        if (err) {
            console.error(err.message);
            res.status(500).send('An error occurred while submitting the form.');
        } else {
            res.status(201).send('Trainee info submitted successfully!');
        }
    });
});

module.exports = router;
