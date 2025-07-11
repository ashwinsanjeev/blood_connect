const {Client}=require('pg');

const client=new Client({
    host: 'localhost',
    user: 'postgres',
    port: 5432,
    password: '0311',
    database: 'blood_donor_connect'
})

client.connect()
    .then(() => console.log('Connected to PostgreSQL database'))
    .catch((err) => console.error('Unable to connect to the database:', err));

module.exports=client;
