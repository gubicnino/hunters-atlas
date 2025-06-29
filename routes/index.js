var express = require('express');
var router = express.Router();
var path = require('path');
var sql = require('../db');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.sendFile(path.join(__dirname, '../public/index.html'));
});

/* GET animals page. */
router.get('/animals.html', function(req, res, next) {
  res.sendFile(path.join(__dirname, '../public/animals.html'));
});

/* GET reserves page. */
router.get('/reserves.html', function(req, res, next) {
  res.sendFile(path.join(__dirname, '../public/reserves.html'));
});

router.get('/test-db', async function(req, res, next) {
  try {
    const result = await sql`SELECT NOW() as current_time, version() as postgres_version`;
    
    res.json({
      success: true,
      message: 'Database connection successful',
      currentTime: result[0].current_time,
      postgresVersion: result[0].postgres_version
    });
    
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Database connection failed',
      error: error.message
    });
  }
});

module.exports = router;