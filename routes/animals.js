var express = require('express');
var router = express.Router();
var path = require('path');
var sql = require('../db');

router.get('/', function (req, res, next) {
    sql`
            SELECT 
    a.*,  -- All columns from animals table
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
    -- Need Zones (from animal_reserve table as JSON)
    (
        SELECT JSON_AGG(
            JSON_BUILD_OBJECT(
                'reserve_id', r.id,
                'reserve_name', r.name,
                'need_zones', JSON_BUILD_OBJECT(
                    'drink', ar.drink_time,
                    'feed', ar.feed_time,
                    'rest', ar.rest_time
                )
            )
        )
        FROM reserves r
        JOIN animal_reserve ar ON r.id = ar.reserve_id
        WHERE ar.animal_id = a.id
    ) AS reserves_with_need_zones
FROM 
    animals a
LEFT JOIN 
    trophy_ratings tr ON a.id = tr.animal_id
-- WHERE clause removed to get all animals
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
router.get('/:reserveID', function (req, res, next) {
    const reserveID = parseInt(req.params.id, 10);
    sql`
            SELECT 
    a.*,  -- All columns from animals table
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
    -- Need Zones (from animal_reserve table as JSON)
    (
        SELECT JSON_AGG(
            JSON_BUILD_OBJECT(
                'reserve_id', r.id,
                'reserve_name', r.name,
                'need_zones', JSON_BUILD_OBJECT(
                    'drink', ar.drink_time,
                    'feed', ar.feed_time,
                    'rest', ar.rest_time
                )
            )
        )
        FROM reserves r
        JOIN animal_reserve ar ON r.id = ar.reserve_id
        WHERE ar.animal_id = a.id
    ) AS reserves_with_need_zones
FROM 
    animals a
LEFT JOIN 
    trophy_ratings tr ON a.id = tr.animal_id
-- WHERE clause removed to get all animals
ORDER BY 
    a.name;
WHERE 
    r.id = ${reserveID}
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