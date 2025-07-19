require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
const {registerDonor,findDonors}=require('./models/donorModels');
const {createBloodRequest}=require('./models/bloodRequestModels');
const {createCampRequest}=require('./models/campRequestModels');
const {registerUser, isEmailTaken, findUserByEmail} = require('./models/userAuthModels');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');



const app = express();
const PORT = 5000;

const EMAIL=process.env.email;
const PASSWORD=process.env.password;

// Middleware
app.use(cors());
app.use(bodyParser.json());

//JWT Middleware
function verifyToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) return res.status(401).json({ message: 'Token missing' });

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ message: 'Invalid token' });
    req.user = user;
    next();
  });
}
// Routes
app.get('/', (req, res) => res.send('Backend is running!'));


// Signup
app.post('/api/auth/signup', async (req, res) => {
    const { username, email, password, confirmPassword } = req.body;

    if (password !== confirmPassword) {
        return res.status(400).json({ message: 'Passwords do not match' });
    }

    try {
        const exists = await isEmailTaken(email);
        if (exists) {
            return res.status(409).json({ message: 'Email already registered' });
        }

        await registerUser({ username, email, password });
        res.status(201).json({ message: 'User registered successfully!' });
    } 
    catch (error) 
    {
        console.error('Signup error:', error);
        res.status(500).json({ message: 'Signup failed', error });
    }
});

// Login
app.post('/api/auth/login', async (req, res) => {
    const { email, password } = req.body;

    try {
    const user = await findUserByEmail(email);
    if (!user) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ message: 'Login successful', token });
    } 
    catch (error) 
    {
        console.error('Login error:', error);
        res.status(500).json({ message: 'Login failed', error });
    }
});


// API for blood request
app.post('/api/request-blood', async (req, res) => {
    const { name, bloodgroup, email, contact, city } = req.body;

    try {
        await createBloodRequest({name,bloodgroup,email,contact,city});
        const donors=await findDonors(bloodgroup,city);
        
        if (donors.length === 0) {
            return res.status(404).json({ message: 'No matching donors found' });
        }

        // Setup email transporter
        const transporter = nodemailer.createTransport({
            host:'smtp.gmail.com',
            port:587,
            secure:false,
            auth: {
                user: 'maximusdesmus33@gmail.com', // Use your email
                pass: 'efnh rglw vfbz vder', // Use an app password for security
            },
        });

        // Send email to each donor
        for (const donor of donors) {
            await transporter.sendMail({
                from: 'maximusdesmus33@gmail.com',
                to: donor.email,
                subject: 'Blood Donation Request',
                text: `Dear ${donor.name},\n\nA patient in ${city} urgently needs blood (${bloodgroup}). Please contact them at ${contact} or ${email} if you can donate.\n\nThank you!`,
            });
        }

        res.status(200).json({ message: 'Request stored and emails sent successfully!' });

    } catch (error) {
        console.error('Error processing request:', error);
        res.status(500).json({ error: 'Failed to store request or send notifications' });
    }
});



// API for camp request
app.post('/api/organize-camp', async (req, res) => {
    const { campname, date, city } = req.body;

    try {
        await createCampRequest({campname, date, city});
        const donors=await findDonors(null,city);
        if(donors.length===0)
        {
            return res.status(200).json({ message: 'Camp organized, but no donors found in the city' });
        }

        // Setup email transporter
        const transporter = nodemailer.createTransport({
            host:'smtp.gmail.com',
            port:587,
            secure:false,
            auth: {
                user: 'maximusdesmus33@gmail.com', // Use your email
                pass: 'efnh rglw vfbz vder', // Use an app password for security
            },
        });

        // Send email to each donor
        for (const donor of donors) {
            await transporter.sendMail({
                from: 'maximusdesmus33@gmail.com',
                to: donor.email,
                subject: 'Upcoming Blood Donation Camp',
                text: `Dear ${donor.name},\n\nWe are organizing a blood donation camp in ${city}.\n\nEvent: ${campname}\nDate: ${date}\nLocation: ${city}\n\nWe invite you to participate and save lives!\n\nThank you!`,
            });
        }

        res.status(200).json({ message: 'Camp Request stored and emails sent successfully!' });

    } catch (error) {
        console.error('Error processing camp request:', error);
        res.status(500).json({ error: 'Failed to store camp request or send notifications' });
    }
});


// Add a new donor
app.post('/api/donors', async (req, res) => {
    try {
        const donor=await registerDonor(req.body);
        res.status(201).json({ message: 'Donor registered successfully!', donor});
    } catch (error) {
        console.error('Error registering donor:', error);
        res.status(500).json({ message: 'Failed to register donor', details: error });
    }
});

app.get('/api/donors', async (req, res) => {
    const bloodgroup = decodeURIComponent(req.query.bloodgroup || '').trim();
    const city = decodeURIComponent(req.query.city || '').trim();

    console.log('Received query:', { bloodgroup, city });

    // Check for missing query parameters
    if (!bloodgroup || !city) {
        return res.status(400).json({ error: 'Both blood group and city are required' });
    }

    try {
        // Apply both conditions
        const donors = await findDonors(bloodgroup,city);
        res.status(200).json(donors);
    } catch (error) {
        console.error('Error fetching donors:', error);
        res.status(500).json({ error: 'Failed to fetch donors', details: error });
    }
});





// Start server
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
