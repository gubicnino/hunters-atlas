var express = require('express');
var router = express.Router();
var path = require('path');
var sql = require('../db');

router.get('/', function (req, res, next) {
    sql`
            SELECT 
            a.*,  -- This will include all columns from animals table
            -- Trophy Ratings
            tr.bronze,
            tr.silver,
            tr.gold,
            tr.diamond,
            -- Fur Variants (aggregated as JSON array)
            (
                SELECT JSON_AGG(
                    JSON_BUILD_OBJECT(
                        'variant', fv.variant,
                        'rarity', fv.rarity
                    )
                )
                FROM fur_variants fv
                WHERE fv.animal_id = a.id
            ) AS fur_variants,
            -- Need Zones (aggregated as JSON array)
            (
                SELECT JSON_AGG(
                    JSON_BUILD_OBJECT(
                        'type', nz.type,
                        'time_range', nz.time_range
                    )
                )
                FROM need_zones nz
                WHERE nz.animal_id = a.id
            ) AS need_zones,
            -- Reserves (aggregated as JSON array)
            (
                SELECT JSON_AGG(
                    JSON_BUILD_OBJECT(
                        'reserve_id', r.id,
                        'reserve_name', r.name
                    )
                )
                FROM reserves r
                JOIN animal_reserve ar ON r.id = ar.reserve_id
                WHERE ar.animal_id = a.id
            ) AS reserves
        FROM 
            animals a
        LEFT JOIN 
            trophy_ratings tr ON a.id = tr.animal_id
        ORDER BY 
        a.name;
        `
        .then(animals => {
            res.json(animals);
        })
        .catch(error => {
            console.error('Error fetching animals:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        });
});
module.exports = router;