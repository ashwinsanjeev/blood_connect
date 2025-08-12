const {Client}=require('pg');
require('dotenv').config();


const client=new Client({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    port: process.env.DB_PORT,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
})

client.connect()
    .then(() => console.log('Connected to PostgreSQL database'))
    .catch((err) => console.error('Unable to connect to the database:', err));

module.exports=client;