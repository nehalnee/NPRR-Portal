const express = require('express');
const serverless = require('serverless-http');
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const session = require('express-session');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');
require('dotenv').config();

const app = express();
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, '../public')));
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

app.use(session({ secret: 'secret', resave: false, saveUninitialized: false }));
app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(
    (username, password, done) => {
        const user = { id: 1, username: 'admin', password: '$2b$10$7Qm5z/0BPRsWbX5nqQfZZeOWfFWSGz2F1xU1eFL9S4yIbHTG1mKly' };

        if (username === user.username) {
            bcrypt.compare(password, user.password, (err, res) => {
                if (res) {
                    return done(null, user);
                } else {
                    return done(null, false, { message: 'Incorrect password.' });
                }
            });
        } else {
            return done(null, false, { message: 'Incorrect username.' });
        }
    }
));

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser((id, done) => {
    const user = { id: 1, username: 'admin' };
    done(null, user);
});

app.post('/login', passport.authenticate('local', {
    successRedirect: '/trainees',
    failureRedirect: '/login'
}));

app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, '../views', 'login.html'));
});

app.get('/trainees', (req, res) => {
    if (req.isAuthenticated()) {
        res.sendFile(path.join(__dirname, '../views', 'trainees.html'));
    } else {
        res.redirect('/login');
    }
});

app.get('/api/trainees', (req, res) => {
    const db = new sqlite3.Database(path.resolve(__dirname, '../trainees.db'));

    db.all('SELECT * FROM trainees', [], (err, rows) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.status(200).json({ trainees: rows });
    });

    db.close();
});

module.exports.handler = serverless(app);
