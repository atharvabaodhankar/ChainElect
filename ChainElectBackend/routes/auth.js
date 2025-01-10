// Import necessary modules
const express = require('express');  // Make sure to import express
const fs = require('fs');
const multer = require('multer');
const bcrypt = require('bcrypt');
const db = require('../models/db'); // Adjust path to your database connection

// Initialize router
const router = express.Router();

// Configure multer for file uploads
const upload = multer({ dest: 'uploads/' });

router.post('/register', upload.single('image'), async (req, res) => {
    const { voter_id, metamask_id, password } = req.body;
    const image = req.file; // Access the uploaded file

    if (!voter_id || !metamask_id || !password || !image) {
        return res.status(400).json({ success: false, message: 'All fields are required' });
    }

    try {
        const hashedPassword = await bcrypt.hash(password, 10);

        // Read the uploaded file as binary data
        const imageData = fs.readFileSync(image.path);

        // Save user to the database with the image as LONGBLOB
        db.query(
            'INSERT INTO voters (voter_id, metamask_id, password, image) VALUES (?, ?, ?, ?)',
            [voter_id, metamask_id, hashedPassword, imageData],
            (err, result) => {
                if (err) {
                    console.error(err);
                    return res.status(500).json({ success: false, message: 'Database error' });
                }
                res.json({ success: true, message: 'Registration successful' });
            }
        );

        // Optionally, delete the uploaded file after saving its content
        fs.unlink(image.path, (err) => {
            if (err) console.error('Failed to delete file:', err);
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// Export the router
module.exports = router;
