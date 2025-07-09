var express = require('express');
var router = express.Router();
var path = require('path');
var sql = require('../db');

router.get('/', function (req, res, next) {
    sql`
            SELECT 
    r.id AS reserve_id,
    r.name AS reserve_name,
    r.location,
    r.map_url,
    STRING_AGG(a.name, ', ' ORDER BY a.name) AS animals_in_reserve
FROM 
    reserves r
LEFT JOIN 
    animal_reserve ar ON r.id = ar.reserve_id
LEFT JOIN 
    animals a ON ar.animal_id = a.id
GROUP BY 
    r.id, r.name, r.location, r.map_url
ORDER BY 
    r.name;
        `
        .then(reserves => {
            res.json(reserves);
            console.log('Reserves fetched successfully:', reserves);
        })
        .catch(error => {
            console.error('Error fetching animals:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        });
});
router.get('/:id', function (req, res, next) {
    sql`
        SELECT 
            r.id AS reserve_id,
            r.name AS reserve_name,
            r.location,
            r.map_url,
            r.description,
            STRING_AGG(a.name, ', ' ORDER BY a.name) AS animals_in_reserve
        FROM 
            reserves r
        LEFT JOIN 
            animal_reserve ar ON r.id = ar.reserve_id
        LEFT JOIN 
            animals a ON ar.animal_id = a.id
        WHERE 
            r.id = ${parseInt(req.params.id, 10)}
        GROUP BY 
            r.id, r.name, r.location, r.map_url, r.description
        ORDER BY 
            r.name;
        `
        .then(reserves => {
            res.json(reserves);
            console.log('Reserves fetched successfully:', reserves);
        })
        .catch(error => {
            console.error('Error fetching reserves:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        });
});
module.exports = router;