const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const bcrypt = require('bcrypt');
const mysql = require('mysql');

const app = express();
const secretKey = 'your_secret_key';

// Database connection
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'chainelect',
});

db.connect((err) => {
    if (err) {
        console.error('Database connection failed:', err);
    } else {
        console.log('Database connected.');
    }
});

// Middleware
app.use(cors({ origin: 'http://localhost:5173', credentials: true }));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(session({
    secret: 'your_session_secret',
    resave: false,
    saveUninitialized: true,
}));

// Authentication routes
app.post('/auth/register', async (req, res) => {
    const { voter_id, metamask_id, password } = req.body;

    if (!voter_id || !metamask_id || !password) {
        return res.status(400).json({ success: false, message: 'All fields are required' });
    }

    try {
        const hashedPassword = await bcrypt.hash(password, 10);

        db.query(
            'INSERT INTO voters (voter_id, metamask_id, password) VALUES (?, ?, ?)',
            [voter_id, metamask_id, hashedPassword],
            (err, result) => {
                if (err) {
                    console.error(err);
                    return res.status(500).json({ success: false, message: 'Database error' });
                }
                res.json({ success: true, message: 'Registration successful' });
            }
        );
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

app.post('/auth/login', (req, res) => {
    const { voter_id, password } = req.body;

    if (!voter_id || !password) {
        return res.status(400).json({ success: false, message: 'All fields are required' });
    }

    db.query('SELECT * FROM voters WHERE voter_id = ?', [voter_id], async (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ success: false, message: 'Database error' });
        }

        if (results.length === 0) {
            return res.status(401).json({ success: false, message: 'Invalid credentials' });
        }

        const voter = results[0];
        const isMatch = await bcrypt.compare(password, voter.password);

        if (!isMatch) {
            return res.status(401).json({ success: false, message: 'Invalid credentials' });
        }

        req.session.voter_id = voter.voter_id;
        res.json({ success: true, message: 'Login successful' });
    });
});

app.post('/auth/logout', (req, res) => {
    req.session.destroy();
    res.json({ success: true, message: 'Logged out successfully' });
});

// New route to fetch user information
app.get('/voters/:voter_id', (req, res) => {
    const { voter_id } = req.params;

    db.query('SELECT voter_id, metamask_id FROM voters WHERE voter_id = ?', [voter_id], (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ success: false, message: 'Database error' });
        }

        if (results.length === 0) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        res.json(results[0]);
    });
});

// Start server
const PORT = 3000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
