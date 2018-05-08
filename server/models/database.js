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

if (false) {
	client.connect();
	const query = client.query(
	  'CREATE TABLE ACCOUNT (' +
		'USER_NAME VARCHAR(40),' +
		'FIRST_NAME VARCHAR(40) not null,' +
		'LAST_NAME VARCHAR(40),' +
		'EMAIL VARCHAR(40) not null,' +
		'PHONE INT,' +
		'ACCOUNT VARCHAR(20),' +
		'PASSWORD VARCHAR(40),' +
		'ISACTIVE BOOLEAN,' +
		'CRCT_TIME TIMESTAMP,' +
		'MODFY_TIME TIMESTAMP,' +
		'PRIMARY KEY (USER_NAME)' +
	')');
	query.on('end', () => { client.end(); });
}

if (false) {
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
}

if (false) {

	client.connect();
	const queryAdr = client.query(
	  'CREATE TABLE REFER (' +
		'USER_NAME VARCHAR(40),' +
		'REF_USER_NAME VARCHAR(40),' +
		'FOREIGN KEY (USER_NAME) REFERENCES ACCOUNT(USER_NAME),' +
		'UNIQUE (USER_NAME, REF_USER_NAME) '+
	')');
	queryAdr.on('end', () => { client.end(); });

}

if (false) {
	
		client.connect();
		const queryAdr = client.query(
		  'CREATE TABLE ALIASE (' +
			'ALIASE_ID SERIAL PRIMARY KEY,' +
			'ADDR_ID INT,' +  
			'ALI_FIRST_NAME VARCHAR(40),' +
			'ALI_LAST_NAME VARCHAR(40),' +
			'CRCT_TIME TIMESTAMP,' +
			'MODFY_TIME TIMESTAMP,' +
			'FOREIGN KEY (ADDR_ID) REFERENCES ADDRESS(ADDR_ID)' +
		')');
		queryAdr.on('end', () => { client.end(); });
	
	}

	if (true) {
		
			client.connect();
			const queryAdr = client.query(
				'CREATE TABLE THIRD_PARTY_ACCOUNT (' +
				'ACCOUNT_ID SERIAL PRIMARY KEY,' +
				'ALIASE_ID INT,' +
				'DOMAIN_NAME VARCHAR(40),' +  
				'DOMAIN_USER_NAME VARCHAR(40),' +
				'DOMAIN_PASSWORD VARCHAR(40),' +
				'EMAIL VARCHAR(40),' +
				'CRCT_TIME TIMESTAMP,' +
				'MODFY_TIME TIMESTAMP,' +
				'FOREIGN KEY (ALIASE_ID) REFERENCES ALIASE(ALIASE_ID)' +
			')');
			queryAdr.on('end', () => { client.end(); });
		
		}