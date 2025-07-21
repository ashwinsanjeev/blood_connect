const client=require('../db');


async function createCampRequest(data) {
  const { campname, date, city } = data;
  const q = `
    INSERT INTO camprequests (campname, date, city, status)
    VALUES ($1, $2, $3, 'pending')
    RETURNING *;
  `;
  const { rows } = await client.query(q, [campname, date, city]);
  return rows[0];
}

async function getPendingCampRequests() {
  const { rows } = await client.query(
    `SELECT * FROM camprequests WHERE status = 'pending' ORDER BY date ASC;`
  );
  return rows;
}

async function approveCampRequest(id) {
  const { rows } = await client.query(
    `UPDATE camprequests SET status = 'approved' WHERE id = $1 RETURNING *;`,
    [id]
  );
  return rows[0];
}

async function deleteCampRequest(id) {
  await client.query(`DELETE FROM camprequests WHERE id = $1;`, [id]);
}

module.exports = {
  createCampRequest,
  getPendingCampRequests,
  approveCampRequest,
  deleteCampRequest
};
