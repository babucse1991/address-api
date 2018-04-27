const pg = require('pg');
const connectionString = process.env.DATABASE_URL || 'postgres://msfrouexbqptiu:4ca612df8639d275cdc747154016be5d155b24972830ea0e2a8706c2c87c82bb@ec2-54-204-21-226.compute-1.amazonaws.com:5432/d1hnmf8ckni5ff';

const client = new pg.Client({
    user: "postgres",
    password: "password",
    database: "postgres",
    port: 5432,
    host: "localhost",
    ssl: false
});

//const client = new pg.Client(connectionString);
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