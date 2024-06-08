const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const sqlite3 = require('sqlite3').verbose();
const session = require('express-session');
const app = express();
const port = 3001;

// Database setup
const db = new sqlite3.Database('trainees.db');

// Session setup
app.use(session({
    secret: 'your_secret_key',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false } // Note: Set secure: true in production
}));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

const requireLogin = (req, res, next) => {
    if (!req.session.user) {
        return res.redirect('/login');
    }
    next();
};

// Serve the login.html file at the /login URL
app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'login.html'));
});

// Handle login
app.post('/login', (req, res) => {
    const { username, password } = req.body;

    // Check credentials (use proper authentication in production)
    if (username === 'admin' && password === 'password') {
        req.session.user = username;
        return res.redirect('/');
    }

    res.send('Invalid credentials');
});

// Serve the trainees.html file at the root URL, protected by login
app.get('/', requireLogin, (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'trainees.html'));
});

// API endpoint to get all trainees
app.get('/api/trainees', requireLogin, (req, res) => {
    db.all("SELECT * FROM trainees", [], (err, rows) => {
        if (err) {
            throw err;
        }
        res.json(rows);
    });
});

// API endpoint to get a specific trainee by ID
app.get('/api/trainees/:id', requireLogin, (req, res) => {
    const id = req.params.id;
    db.get("SELECT * FROM trainees WHERE id = ?", [id], (err, row) => {
        if (err) {
            res.status(500).send(err.message);
            return;
        }
        res.json(row);
    });
});

// API endpoint to edit a trainee
app.post('/trainees/edit', requireLogin, (req, res) => {
    const { id, fullName, age, gender, placeOfBirth, affiliationNumber, number } = req.body;

    db.run(`UPDATE trainees SET fullName = ?, age = ?, gender = ?, placeOfBirth = ?, affiliationNumber = ?, number = ? WHERE id = ?`,
        [fullName, age, gender, placeOfBirth, affiliationNumber, number, id],
        function (err) {
            if (err) {
                return res.send('Error occurred while updating the trainee info.');
            }
            res.send('Trainee updated successfully');
        }
    );
});

// API endpoint to delete a trainee
app.post('/trainees/delete', requireLogin, (req, res) => {
    const { id } = req.body;

    db.run(`DELETE FROM trainees WHERE id = ?`, id, function (err) {
        if (err) {
            return res.send('Error occurred while deleting the trainee info.');
        }
        res.send('Trainee deleted successfully');
    });
});

app.listen(port, () => {
    console.log(`View portal listening at http://localhost:${port}`);
});
