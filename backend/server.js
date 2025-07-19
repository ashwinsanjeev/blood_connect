require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const authRoutes = require('./routes/userAuthRoutes');
const donorRoutes = require('./routes/donorRoutes');
const bloodRequestRoutes = require('./routes/bloodRequestRoutes');
const campRequestRoutes = require('./routes/campRequestRoutes');

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Mount route handlers
app.use('/api/auth', authRoutes);
app.use('/api/donors', donorRoutes);
app.use('/api/request-blood', bloodRequestRoutes);
app.use('/api/organize-camp', campRequestRoutes);

app.get('/', (req, res) => res.send('Blood Donor Backend')); 
app.listen(process.env.PORT, () => console.log(`Server running on http://localhost:${process.env.PORT}`));