const express = require('express');
const router = express.Router();
const pg = require('pg');
const path = require('path');
const connectionString = process.env.DATABASE_URL || 'postgres://msfrouexbqptiu:4ca612df8639d275cdc747154016be5d155b24972830ea0e2a8706c2c87c82bb@ec2-54-204-21-226.compute-1.amazonaws.com:5432/d1hnmf8ckni5ff';

const client = new pg.Client({
    user: "postgres",
    password: "password",
    database: "postgres",
    port: 5432,
    host: "localhost",
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
      done();
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
      done();
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

router.post('/api/v1/address', (req, res, next) => {
  const results = [];
  const data = req.body;

    client.connect(function (err, client, done) {

      if(err) {
        done();
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

router.get('/api/v1/address', (req, res, next) => {
  const results = [];

  client.connect( function (err, client, done) {

    if(err) {
      done();
      console.log(err);
      return res.status(500).json({success: false, data: err});
    }
    
    const query = client.query('SELECT * FROM ADDRESS ORDER BY MODFY_TIME ASC;');
    
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
         [data.username, data.firstName, data.lastName, data.email, data.phone, data.account, data.password]);
      
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
