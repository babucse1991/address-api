const express = require('express');
const pg = require('pg');
const router = express.Router();
const proConst = require('../constants');

const config = {
  user: proConst.dbConst.user,
  database: proConst.dbConst.database,
  password: proConst.dbConst.password,
  port: 5432, 
  max: 10, 
  idleTimeoutMillis: 30000 
};
var client = new pg.Pool(config);

router.post('/api/v1/aliase', (req, res, next) => {
  const results = [];
  const data = req.body;
  console.log('addressId : '+ data.addressId);
    client.connect(function (err, client, done) {

      if(err) {
        done();
        console.log(err);
        return res.status(500).json({success: false, data: err});
      }

      const query  = client.query( 'INSERT INTO ALIASE( ADDR_ID, ALI_FIRST_NAME, ALI_LAST_NAME, CRCT_TIME, MODFY_TIME) ' +
                        'values($1, $2, $3, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP )',
         [data.addressId, data.aliFirstName, data.aliLastName]);
      
      query.on('error', function(err) {
          console.log('Query error: ' + err);
          return res.status(500).json({success: false, error: err});
      });
      query.on('end', () => {
        done();
        return res.status(200).json({success: true, data: 'success'});
      });
      
    });
});

router.get('/api/v1/aliase/:addressId', (req, res, next) => {
  var addressId = req.params.addressId;
  console.log('>>>>>>>>>>>>' + addressId);
  const results = [];
  client.connect( function (err, client, done) {
     if(err) {
      done();
      console.log(err);
      return res.status(500).json({success: false, data: err});
    }
    const query = client.query('SELECT *  FROM ALIASE WHERE ADDR_ID = $1', [addressId]);
    query.on('row', (row) => {
      results.push(row);
    });
    query.on('end', () => {
      done();
      return res.json(results);
    });
  });
});

router.post('/api/v1/account', (req, res, next) => {
  const results = [];
  const data = req.body;

    client.connect(function (err, client, done) {

      if(err) {
        done();
        console.log(err);
        return res.status(500).json({success: false, data: err});
      }

      const query  = client.query( 'INSERT INTO THIRD_PARTY_ACCOUNT( ALIASE_ID, DOMAIN_NAME, DOMAIN_USER_NAME, DOMAIN_PASSWORD, EMAIL, CRCT_TIME, MODFY_TIME ) ' +
                        'values($1, $2, $3, $4, $5, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP )',
         [data.aliceId, data.domain, data.username, data.password, data.email ]);
      
      query.on('error', function(err) {
          console.log('Query error: ' + err);
          return res.status(500).json({success: false, error: err});
      });
      query.on('end', () => {
        done();
        return res.status(200).json({success: true, data: 'success'});
      });
      
    });
});

router.get('/api/v1/account/:aliaseId', (req, res, next) => {
  var aliaseId = req.params.aliaseId;
  console.log('>>>>>>>>>>>>' + aliaseId);
  const results = [];
  client.connect( function (err, client, done) {
     if(err) {
      done();
      console.log(err);
      return res.status(500).json({success: false, data: err});
    }
    const query = client.query('SELECT *  FROM THIRD_PARTY_ACCOUNT WHERE ALIASE_ID = $1', [aliaseId]);
    query.on('row', (row) => {
      results.push(row);
    });
    query.on('end', () => {
      done();
      return res.json(results);
    });
  });
});

module.exports = router;
