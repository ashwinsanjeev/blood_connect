const client=require('../db');

async function createBloodRequest(data){
    const{name, bloodgroup, email, contact, city}=data;
    const query=`INSERT INTO bloodrequests(name,bloodgroup,email,contact,city) VALUES ($1, $2, $3, $4, $5)`;
    const values=[name,bloodgroup,email,contact,city];
    const result=await client.query(query,values);
}

module.exports={createBloodRequest};