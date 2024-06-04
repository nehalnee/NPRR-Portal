const express = require('express');
const multer = require('multer');
const path = require('path');
const sqlite3 = require('sqlite3').verbose();
const bodyParser = require('body-parser');

const app = express();

// Set up storage engine for multer
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/uploads');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname);
    }
});

const upload = multer({ storage: storage });

// Connect to SQLite database
const db = new sqlite3.Database('trainees.db');

// Create table if it doesn't exist
db.run(`CREATE TABLE IF NOT EXISTS trainees (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    fullName TEXT,
    age INTEGER,
    gender TEXT,
    placeOfBirth TEXT,
    affiliationNumber TEXT,
    number TEXT,
    cardPic TEXT
)`);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

app.post('/api/trainees/submit', upload.single('cardPic'), (req, res) => {
    const { fullName, age, gender, placeOfBirth, affiliationNumber, number } = req.body;
    const cardPic = req.file ? `/uploads/${req.file.filename}` : null;

    db.run(
        `INSERT INTO trainees (fullName, age, gender, placeOfBirth, affiliationNumber, number, cardPic) VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [fullName, age, gender, placeOfBirth, affiliationNumber, number, cardPic],
        (err) => {
            if (err) {
                return res.status(500).send('An error occurred while submitting the form.');
            }
            res.send('Trainee info submitted successfully!');
        }
    );
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Submit portal server running on port ${PORT}`);
});
