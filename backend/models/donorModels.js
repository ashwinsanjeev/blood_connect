const client=require('../db');

async function registerDonor(data){
    const{name, bloodgroup, email, contact, city}=data;
    const query=`INSERT INTO donors("name", "bloodgroup", "email", "contact", "city") VALUES ($1, $2, $3, $4, $5)`;
    const values=[name,bloodgroup,email,contact,city];
    const result=await client.query(query,values);
}

async function findDonors(bloodgroup,city) {
    let query, values;

    if (bloodgroup) {
        query = `SELECT * FROM donors WHERE bloodgroup = $1 AND city = $2`;
        values = [bloodgroup, city];
    } else {
        query = `SELECT * FROM donors WHERE city = $1`;
        values = [city];
    }

    const result = await client.query(query, values);
    return result.rows;
}

module.exports={registerDonor,findDonors};