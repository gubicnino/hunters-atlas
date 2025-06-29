var express = require('express');
var router = express.Router();
var path = require('path');
var sql = require('../db');

router.get('/', function(req, res, next) {
    sql`SELECT * FROM animals`
        .then(animals => {
            res.json(animals);
        })
        .catch(error => {
            console.error('Error fetching animals:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        });
});
module.exports = router;