const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const router = express.Router();
const path = require('path');

const db = new sqlite3.Database('trainees.db');

router.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, '../views/login.html'));
});

router.post('/login', (req, res) => {
    const { username, password } = req.body;
    if (username === 'admin' && password === 'password') {
        req.session.loggedIn = true;
        res.redirect('/trainees');
    } else {
        res.send('Invalid username or password');
    }
});

router.get('/trainees', (req, res) => {
    if (req.session.loggedIn) {
        db.all('SELECT * FROM trainees', (err, rows) => {
            if (err) {
                res.send('An error occurred');
                return;
            }
            res.render('trainees', { trainees: rows });
        });
    } else {
        res.redirect('/login');
    }
});

module.exports = router;
