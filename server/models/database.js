const pg = require('pg');
const proConst = require('../constants');

const client = new pg.Client({
    user: proConst.dbConst.user,
    password: proConst.dbConst.password,
    database: proConst.dbConst.database,
    port: proConst.dbConst.port,
    host: proConst.dbConst.host,
    ssl: false
});

// const client = new pg.Client(connectionString);
// client.connect();
// const query = client.query(
//   'CREATE TABLE items(id SERIAL PRIMARY KEY, text VARCHAR(40) not null, complete BOOLEAN)');
// query.on('end', () => { client.end(); });

// client.connect();
// const query = client.query(
//   'CREATE TABLE ACCOUNT (' +
// 	'USER_NAME VARCHAR(40),' +
// 	'FIRST_NAME VARCHAR(40) not null,' +
// 	'LAST_NAME VARCHAR(40),' +
// 	'EMAIL VARCHAR(40) not null,' +
// 	'PHONE INT,' +
// 	'ACCOUNT VARCHAR(20),' +
// 	'PASSWORD VARCHAR(40),' +
// 	'ISACTIVE BOOLEAN,' +
// 	'CRCT_TIME TIMESTAMP,' +
// 	'MODFY_TIME TIMESTAMP,' +
// 	'PRIMARY KEY (USER_NAME)' +
// ')');
// query.on('end', () => { client.end(); });


client.connect();
const queryAdr = client.query(
  'CREATE TABLE ADDRESS (' +
	'ADDR_ID SERIAL PRIMARY KEY,' +
	'USER_NAME VARCHAR(40),' +
	'STREET VARCHAR(40),' +
	'STREE2 VARCHAR(40),' +
	'COUNTRY VARCHAR(40),' +
	'CITY VARCHAR(40),' +
	'STATE VARCHAR(40),' +
	'PIN_CODE INT,' +
	'DAILY_PKG_LMIT INT,' +
	'CRCT_TIME TIMESTAMP,' +
	'MODFY_TIME TIMESTAMP,' +
	'FOREIGN KEY (USER_NAME) REFERENCES ACCOUNT(USER_NAME)' +
')');
queryAdr.on('end', () => { client.end(); });