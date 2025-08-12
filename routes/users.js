var express = require('express');
var router = express.Router();
var path = require('path');
var supabase = require('../db');

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

module.exports = router;
