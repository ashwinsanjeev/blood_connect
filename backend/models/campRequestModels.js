const client=require('../db');

async function createCampRequest(data){
    const{campname, date, city}=data;
    const query=`INSERT INTO camprequests(campname,date,city) VALUES ($1, $2, $3)`;
    const values=[campname,date,city];
    const result=await client.query(query,values);
}

module.exports={createCampRequest};