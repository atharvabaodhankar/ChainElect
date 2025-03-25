const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const { createClient } = require('@supabase/supabase-js');
const multer = require('multer');
const path = require('path');

const app = express();
const secretKey = 'your_secret_key';

// Supabase configuration
const supabaseUrl = 'https://hanlwbbbniiujtzutpbv.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imhhbmx3YmJibmlpdWp0enV0cGJ2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzk5NzM3MjgsImV4cCI6MjA1NTU0OTcyOH0.WG-NlQ4atZdiQVPPqPNefAQJS00ObgV-73tGrWgHEgY';
const supabase = createClient(supabaseUrl, supabaseKey);

// Configure multer for image upload
const storage = multer.memoryStorage();
const upload = multer({ 
    storage: storage,
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB limit
    },
    fileFilter: (req, file, cb) => {
        const allowedTypes = /jpeg|jpg|png/;
        const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = allowedTypes.test(file.mimetype);
        if (extname && mimetype) {
            cb(null, true);
        } else {
            cb(new Error('Only .png, .jpg and .jpeg format allowed!'));
        }
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
app.post('/auth/register', upload.single('image'), async (req, res) => {
    const { voter_id, metamask_id, email, password, face_descriptor } = req.body;
    
    // Parse face descriptor if it's a string
    let parsedFaceDescriptor;
    try {
        parsedFaceDescriptor = typeof face_descriptor === 'string' ? JSON.parse(face_descriptor) : face_descriptor;
    } catch (error) {
        console.error('Face descriptor parsing error:', error);
        return res.status(400).json({ success: false, message: 'Invalid face descriptor format' });
    }

    if (!voter_id || !metamask_id || !email || !password || !req.file || !face_descriptor) {
        return res.status(400).json({ success: false, message: 'All fields including face capture are required' });
    }

    try {
        // Check if voter_id already exists
        const { data: existingVoter, error: voterCheckError } = await supabase
            .from('voters')
            .select('voter_id')
            .eq('voter_id', voter_id)
            .single();

        if (existingVoter) {
            return res.status(400).json({ 
                success: false, 
                message: 'Voter ID already registered' 
            });
        }

        // First register the user with Supabase Auth
        const { data: authData, error: authError } = await supabase.auth.signUp({
            email,
            password,
            options: {
                emailRedirectTo: 'http://localhost:5173/login'
            }
        });

        if (authError) {
            console.error('Auth error:', authError);
            return res.status(500).json({ 
                success: false, 
                message: authError.message,
                isEmailError: authError.message.includes('email')
            });
        }

        // Upload image to Supabase Storage
        const timestamp = Date.now();
        const fileExtension = path.extname(req.file.originalname);
        const fileName = `${voter_id}-${timestamp}${fileExtension}`;
        
        const { data: uploadData, error: uploadError } = await supabase.storage
            .from('voter-images')
            .upload(fileName, req.file.buffer);

        if (uploadError) {
            console.error('Upload error:', uploadError);
            return res.status(500).json({ success: false, message: 'Failed to upload image' });
        }

        // Get the public URL of the uploaded image
        const { data: { publicUrl } } = supabase.storage
            .from('voter-images')
            .getPublicUrl(fileName);

        // Insert voter data into the voters table
        const { data: voterData, error: voterError } = await supabase
            .from('voters')
            .insert([{
                auth_user_id: authData.user.id,
                voter_id,
                metamask_id,
                email,
                image_url: publicUrl,
                face_descriptor: parsedFaceDescriptor
            }]);

        if (voterError) {
            console.error('Database error:', voterError);
            return res.status(500).json({ success: false, message: 'Failed to create voter record' });
        }

        res.json({ 
            success: true, 
            message: 'Registration successful! A confirmation email has been sent.',
            email: email,
            confirmationSent: true
        });

    } catch (err) {
        console.error('Server error:', err);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

app.post('/auth/login', async (req, res) => {
    const { email, password, metamask_id } = req.body;

    if (!email || !password) {
        return res.status(400).json({ success: false, message: 'All fields are required' });
    }

    try {
        // Sign in with Supabase Auth
        const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
            email,
            password
        });

        if (authError) {
            return res.status(401).json({ success: false, message: 'Invalid credentials' });
        }

        // Get voter information
        const { data: voterData, error: voterError } = await supabase
            .from('voters')
            .select('*')
            .eq('auth_user_id', authData.user.id)
            .single();

        if (voterError) {
            return res.status(500).json({ success: false, message: 'Failed to fetch voter data' });
        }

        // Validate Metamask ID if provided
        if (metamask_id && voterData.metamask_id.toLowerCase() !== metamask_id.toLowerCase()) {
            return res.status(401).json({ 
                success: false, 
                message: 'The connected Metamask wallet does not match the one registered with this account.' 
            });
        }

        req.session.voter_id = voterData.voter_id;
        res.json({ 
            success: true, 
            message: 'Login successful',
            voter: {
                voter_id: voterData.voter_id,
                metamask_id: voterData.metamask_id,
                email: voterData.email,
                image_url: voterData.image_url
            }
        });

    } catch (err) {
        console.error('Server error:', err);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

app.post('/auth/logout', async (req, res) => {
    try {
        const { error } = await supabase.auth.signOut();
        if (error) throw error;
        
        req.session.destroy();
        res.json({ success: true, message: 'Logged out successfully' });
    } catch (err) {
        console.error('Logout error:', err);
        res.status(500).json({ success: false, message: 'Failed to logout' });
    }
});

// Route to fetch user information
app.get('/voters/:voter_id', async (req, res) => {
    const { voter_id } = req.params;

    try {
        const { data: voter, error } = await supabase
            .from('voters')
            .select('voter_id, metamask_id, email, image_url , face_descriptor')
            .eq('voter_id', voter_id)
            .single();

        if (error) {
            console.error('Database error:', error);
            return res.status(500).json({ success: false, message: 'Database error' });
        }

        if (!voter) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        res.json(voter);
    } catch (err) {
        console.error('Server error:', err);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// Start server
const PORT = 3000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
