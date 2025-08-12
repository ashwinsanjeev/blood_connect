const {Client}=require('pg');
require('dotenv').config();


const client=new Client({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'postgres',
    port: process.env.DB_PORT || 5432,
    password: process.env.DB_PASSWORD || '0311',
    database: process.env.DB_NAME || 'blood_donor_connect'
})

client.connect()
    .then(() => console.log('Connected to PostgreSQL database'))
    .catch((err) => console.error('Unable to connect to the database:', err));

module.exports=client;