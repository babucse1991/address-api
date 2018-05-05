const express = require('express');
const router = express.Router();
const pg = require('pg');
const path = require('path');
const proConst = require('../constants');
const connectionString = process.env.DATABASE_URL || 'postgres://msfrouexbqptiu:4ca612df8639d275cdc747154016be5d155b24972830ea0e2a8706c2c87c82bb@ec2-54-204-21-226.compute-1.amazonaws.com:5432/d1hnmf8ckni5ff';

const client = new pg.Client({
    user: proConst.dbConst.user,
    password: proConst.dbConst.password,
    database: proConst.dbConst.database,
    port: proConst.dbConst.port,
    host: proConst.dbConst.host,
    ssl: false
});


router.get('/', (req, res, next) => {
  res.sendFile(path.join(
    __dirname, '..', '..', 'client', 'views', 'index.html'));
});

router.get('/api/v1/todos', (req, res, next) => {
  const results = [];
  // Get a Postgres client from the connection pool
  client.connect( function (err, client, done) {
    // Handle connection errors
    if(err) {
      console.log(err);
      return res.status(500).json({success: false, data: err});
    }
    // SQL Query > Select Data
    const query = client.query('SELECT * FROM items ORDER BY id ASC;');
    // Stream results back one row at a time
    query.on('row', (row) => {
      results.push(row);
    });
    // After all data is returned, close connection and return results
    query.on('end', () => {
      //done();
      return res.json(results);
    });
  });
});

router.post('/api/v1/todos', (req, res, next) => {
  const results = [];
  // Grab data from http request
  const data = {text: req.body.text, complete: false};
  // Get a Postgres client from the connection pool
  client.connect(function (err, client, done) {
    // Handle connection errors
    if(err) {
      console.log(err);
      return res.status(500).json({success: false, data: err});
    }
    // SQL Query > Insert Data
    client.query('INSERT INTO items(text, complete) values($1, $2)',
    [data.text, data.complete]);
    // SQL Query > Select Data
    const query = client.query('SELECT * FROM items ORDER BY id ASC');
    // Stream results back one row at a time
    query.on('row', (row) => {
      results.push(row);
    });
    // After all data is returned, close connection and return results
    query.on('end', () => {
      //done();
      return res.json(results);
    });
  });
});

router.get('/api/v1/user-list', (req, res, next) => {
  const results = [];
  client.connect( function (err, client, done) {
     if(err) {
      console.log(err);
      return res.status(500).json({success: false, data: err});
    }
    const query = client.query('SELECT USER_NAME AS userId, FIRST_NAME || \', \' ||LAST_NAME AS name  FROM ACCOUNT ORDER BY FIRST_NAME ASC;');
    query.on('row', (row) => {
      results.push(row);
    });
    query.on('end', () => {
      return res.json(results);
    });
    
  });
});

router.get('/api/v1/refferal-list/:username', (req, res, next) => {
  var username = req.params.username;
  console.log('>>>>>>>>>>>>' + username);
  const results = [];
  client.connect( function (err, client, done) {
     if(err) {
      console.log(err);
      return res.status(500).json({success: false, data: err});
    }
    const query = client.query('SELECT ac.USER_NAME AS userId, FIRST_NAME ||  \', \' || LAST_NAME AS name  FROM ' +
      'ACCOUNT ac INNER JOIN REFER rf ON ac.USER_NAME = rf.REF_USER_NAME ' + 
      'WHERE rf.USER_NAME = $1 ORDER  BY FIRST_NAME ASC;',
    [username]);
    query.on('row', (row) => {
      results.push(row);
    });
    query.on('end', () => {
      return res.json(results);
    });
  });
});

router.post('/api/v1/new-referer', (req, res, next) => {
  const results = [];
  const data = req.body;

    client.connect(function (err, client, done) {

      if(err) {
        console.log(err);
        return res.status(500).json({success: false, data: err});
      }

      const query  = client.query( 'INSERT INTO REFER( USER_NAME, REF_USER_NAME ) ' +
                      'values( $1, $2 )', [data.userId, data.newRefferId]);
      query.on('error', function(err) {
          console.log('Query error: ' + err);
          return res.status(500).json({success: false, error: err});
      });
      query.on('end', () => {
        return res.status(200).json({success: true, data: 'success'});
      });
      
    });
});

router.post('/api/v1/address', (req, res, next) => {
  const results = [];
  const data = req.body;

    client.connect(function (err, client, done) {

      if(err) {
        console.log(err);
        return res.status(500).json({success: false, data: err});
      }

      const query  = client.query( 'INSERT INTO ADDRESS( USER_NAME, STREET, STREE2, COUNTRY, CITY, STATE, PIN_CODE, DAILY_PKG_LMIT, CRCT_TIME, MODFY_TIME) ' +
                        'values($1, $2, $3, $4, $5, $6, $7, 01, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP )',
         [data.username, data.street, data.streetTwo, data.country, data.city, data.state, data.pinCode]);
      query.on('error', function(err) {
          console.log('Query error: ' + err);
          return res.status(500).json({success: false, error: err});
      });
      query.on('end', () => {
        return res.status(200).json({success: true, data: 'success'});
      });
      
    });
});


router.post('/api/v1/update-address', (req, res, next) => {
  const results = [];
  const data = req.body;

    client.connect(function (err, client, done) {

      if(err) {
        console.log(err);
        return res.status(500).json({success: false, data: err});
      }

      const query  = client.query( 'UPDATE ADDRESS SET STREET = $1, STREE2 = $2, COUNTRY = $3, CITY = $4, STATE = $5, PIN_CODE = $6, MODFY_TIME = CURRENT_TIMESTAMP ' +
                        'WHERE ADDR_ID = $7 ',
         [data.street, data.stree2, data.country, data.city, data.state, data.pin_code, data.addr_id]);
      query.on('error', function(err) {
          console.log('Query error: ' + err);
          return res.status(500).json({success: false, error: err});
      });
      query.on('end', () => {
        return res.status(200).json({success: true, data: 'success'});
      });
      
    });
});

router.post('/api/v1/address-search', (req, res, next) => {
  const results = [];
  const data = req.body;
  var sql =  'SELECT adr.* FROM ADDRESS adr '+
  'INNER JOIN ACCOUNT act ON adr.USER_NAME = act.USER_NAME ';
  sql =  sql + 'WHERE ';  
  if ( data.firstName != null && data.firstName != '' ) {
    sql =  sql + 'LOWER(FIRST_NAME) = LOWER(\'' + data.firstName + '\') AND ' ;
  }
  if ( data.lastName != null && data.lastName != '' ) {
    sql = sql +  'LOWER(LAST_NAME) = LOWER(\'' + data.lastName + '\')  AND ' ;
  }
  if ( data.userName != null && data.userName != '' ) {
    sql = sql +  'LOWER(adr.USER_NAME) = LOWER(\'' + data.userName + '\')  AND ' ;
  }
  sql = sql.substr(0, (sql.length - 4));
  sql = sql + 'ORDER BY adr.MODFY_TIME DESC;'
console.log(sql);
  client.connect( function (err, client, done) {

    if(err) {
      console.log(err);
      return res.status(500).json({success: false, data: err});
    }
    const query = client.query(sql);
    
    query.on('row', (row) => {
      results.push(row);
    });
    
    query.on('end', () => {
      return res.json(results);
    });

  });
});


router.post('/api/v1/agent-address-search', (req, res, next) => {
  const results = [];
  const data = req.body;
  var sql =  'SELECT DISTINCT adr.* FROM REFER rf ';
  sql =  sql + 'INNER JOIN ADDRESS adr ON adr.USER_NAME = rf.REF_USER_NAME ';
  sql =  sql + 'INNER JOIN ACCOUNT act ON  adr.USER_NAME = act.USER_NAME ';
  sql =  sql + 'WHERE ';  
  if ( data.firstName != null && data.firstName != '' ) {
    sql =  sql + 'LOWER(FIRST_NAME) = LOWER(\'' + data.firstName + '\') AND ' ;
  }
  if ( data.lastName != null && data.lastName != '' ) {
    sql = sql +  'LOWER(LAST_NAME) = LOWER(\'' + data.lastName + '\')  AND ' ;
  }
  if ( data.agentUserName != null && data.agentUserName != '' ) {
    sql = sql +  'LOWER(rf.USER_NAME) = LOWER(\'' + data.agentUserName + '\')  AND ' ;
  }
  
  sql = sql.substr(0, (sql.length - 4));
  sql = sql + 'ORDER BY adr.MODFY_TIME DESC;'
console.log(sql);
  client.connect( function (err, client, done) {

    if(err) {
      console.log(err);
      return res.status(500).json({success: false, data: err});
    }
    const query = client.query(sql);
    
    query.on('row', (row) => {
      results.push(row);
    });
    
    query.on('end', () => {
      return res.json(results);
    });

  });
});


router.post('/api/v1/signup', (req, res, next) => {
  const results = [];
  const data = req.body;

    client.connect(function (err, client, done) {

      if(err) {
        done();
        console.log(err);
        return res.status(500).json({success: false, data: err});
      }

      const query  = client.query( 'INSERT INTO ACCOUNT( USER_NAME, FIRST_NAME, LAST_NAME, EMAIL, PHONE, ACCOUNT, PASSWORD, ISACTIVE, CRCT_TIME, MODFY_TIME) ' +
                        'values($1, $2, $3, $4, $5, $6, $7, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP )',
         [data.username, data.firstName, data.lastName, data.email, data.phone, data.domain, data.password]);
      
      query.on('error', function(err) {
          console.log('Query error: ' + err);
          return res.status(500).json({success: false, error: err});
      });
      query.on('end', () => {
        return res.status(200).json({success: true, data: 'success'});
      });
      
    });
});

router.post('/api/v1/login', (req, res, next) => {
  const results = [];
  const data = req.body;
  
  client.connect( function (err, client, done) {

    if(err) {
      done();
      console.log(err);
      return res.status(500).json({success: false, data: err});
    }
    
    const query = client.query('SELECT * FROM ACCOUNT WHERE USER_NAME = $1', [data.userName]);
    
    query.on('row', (row) => {
      results.push(row);
    });
    
    query.on('end', () => {
    	console.log('results.lenght  :' + results.length );
    	if ( results.length == 0 ) {
    		return res.status(500).json({success: false, data: 'invalid username'});
    	} else if (results[0].password == data.password) {
    		return res.status(200).json({success: true, data: results[0]});
    	} else {
    		return res.status(500).json({success: false, data: 'invalid password'});
    	}
      
    });

  });
});

router.put('/api/v1/todos/:todo_id', (req, res, next) => {
  const results = [];
  // Grab data from the URL parameters
  const id = req.params.todo_id;
  // Grab data from http request
  const data = {text: req.body.text, complete: req.body.complete};
  // Get a Postgres client from the connection pool
  pg.connect(connectionString, (err, client, done) => {
    // Handle connection errors
    if(err) {
      done();
      console.log(err);
      return res.status(500).json({success: false, data: err});
    }
    // SQL Query > Update Data
    client.query('UPDATE items SET text=($1), complete=($2) WHERE id=($3)',
    [data.text, data.complete, id]);
    // SQL Query > Select Data
    const query = client.query("SELECT * FROM items ORDER BY id ASC");
    // Stream results back one row at a time
    query.on('row', (row) => {
      results.push(row);
    });
    // After all data is returned, close connection and return results
    query.on('end', function() {
      done();
      return res.json(results);
    });
  });
});

router.delete('/api/v1/todos/:todo_id', (req, res, next) => {
  const results = [];
  // Grab data from the URL parameters
  const id = req.params.todo_id;
  // Get a Postgres client from the connection pool
  pg.connect(connectionString, (err, client, done) => {
    // Handle connection errors
    if(err) {
      done();
      console.log(err);
      return res.status(500).json({success: false, data: err});
    }
    // SQL Query > Delete Data
    client.query('DELETE FROM items WHERE id=($1)', [id]);
    // SQL Query > Select Data
    var query = client.query('SELECT * FROM items ORDER BY id ASC');
    // Stream results back one row at a time
    query.on('row', (row) => {
      results.push(row);
    });
    // After all data is returned, close connection and return results
    query.on('end', () => {
      done();
      return res.json(results);
    });
  });
});

module.exports = router;
