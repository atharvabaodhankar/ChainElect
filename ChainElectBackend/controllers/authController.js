const db = require('../models/db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const secretKey = 'GxF4B9xKpN7dJ8fL6eI4cF8aS5dR6gT7yH8iJ9kL0pM1nO2qP3rS4tU5vW6xY7zA8bC9dE';

exports.login = (req, res) => {
    const { voter_id, password } = req.body;

    db.query('SELECT * FROM voters WHERE voter_id = ?', [voter_id], async (err, results) => {
        if (err) return res.status(500).json({ success: false, message: 'Database error' });

        if (results.length === 0) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        const user = results[0];
        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(401).json({ success: false, message: 'Invalid password' });
        }

        const token = jwt.sign({ voter_id: user.voter_id }, secretKey, { expiresIn: '1h' });
        res.cookie('authToken', token, { httpOnly: true }).json({ success: true, message: 'Login successful' });
    });
};

exports.checkSession = (req, res) => {
    const token = req.cookies.authToken;

    if (!token) {
        return res.status(401).json({ success: false, message: 'Not authenticated' });
    }

    try {
        const decoded = jwt.verify(token, secretKey);
        res.json({ success: true, message: 'Authenticated', voter_id: decoded.voter_id });
    } catch (err) {
        res.status(401).json({ success: false, message: 'Invalid token' });
    }
};

exports.logout = (req, res) => {
    res.clearCookie('authToken').json({ success: true, message: 'Logout successful' });
};
