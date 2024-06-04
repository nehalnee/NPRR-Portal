const express = require('express');
const session = require('express-session');
const path = require('path');
const bodyParser = require('body-parser');
const viewRoutes = require('./routes/viewRoutes');

const app = express();

app.use(session({
    secret: 'your-secret-key',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }
}));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'html');
app.set('views', path.join(__dirname, 'views'));
app.engine('html', require('ejs').renderFile);

app.use('/', viewRoutes);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`View portal server running on port ${PORT}`);
});
