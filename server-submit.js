const express = require('express');
const bodyParser = require('body-parser');
const multer = require('multer');
const path = require('path');
const sqlite3 = require('sqlite3').verbose();
const app = express();
const port = 3000;

// Set up storage for file uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname);
    }
});

const upload = multer({ storage: storage });

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

// Database setup
const db = new sqlite3.Database('trainees.db');

// Serve the submit.html file at the root URL
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'submit.html'));
});

// Handle form submissions
app.post('/api/trainees/submit', upload.single('cardPic'), (req, res) => {
    const { fullName, age, gender, placeOfBirth, affiliationNumber, number } = req.body;
    const cardPic = req.file.filename;

    db.run(`INSERT INTO trainees (fullName, age, gender, placeOfBirth, affiliationNumber, number, cardPic) VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [fullName, age, gender, placeOfBirth, affiliationNumber, number, cardPic],
        function (err) {
            if (err) {
                return res.json({ success: false, error: err.message });
            }
            res.json({ success: true });
        }
    );
});

app.listen(port, () => {
    console.log(`Submit portal listening at http://localhost:${port}`);
});
