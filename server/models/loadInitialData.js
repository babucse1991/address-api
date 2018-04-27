const pg = require('pg');

const client = new pg.Client({
    user: "postgres",
    password: "password",
    database: "postgres",
    port: 5432,
    host: "localhost",
    ssl: false
});



client.connect();
const query = client.query('INSERT INTO ACCOUNT( USER_NAME, FIRST_NAME, LAST_NAME, EMAIL, PHONE, ACCOUNT, PASSWORD, ISACTIVE, CRCT_TIME, MODFY_TIME) ' +
        'values($1, $2, $3, $4, $5, $6, $7, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP )',
      ['testUser', 'Babu', 'Selvam', 'test@gmail.com', '654856', 'Admin', 'test123']);
query.on('end', () => { client.end(); });

