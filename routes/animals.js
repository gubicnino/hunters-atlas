var express = require('express');
var router = express.Router();
var path = require('path');
var sql = require('../db');

router.get('/', function (req, res, next) {
    const reserveID = req.query.reserveID;
    
    let query;
    
    if (reserveID) {
        query = sql`
            SELECT 
                a.*,
                tr.bronze,
                tr.silver,
                tr.gold,
                tr.diamond,
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
            WHERE EXISTS (
                SELECT 1 FROM animal_reserve ar2 
                WHERE ar2.animal_id = a.id 
                AND ar2.reserve_id = ${parseInt(reserveID, 10)}
            )
            ORDER BY 
                a.name;
        `;
    } else {
        query = sql`
            SELECT 
                a.*,
                tr.bronze,
                tr.silver,
                tr.gold,
                tr.diamond,
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
            ORDER BY 
                a.name;
        `;
    }
    
    query
        .then(animals => {
            res.json(animals);
        })
        .catch(error => {
            console.error('Error fetching animals:', error);
            console.error('Reserve ID:', reserveID);
            res.status(500).json({ error: 'Internal Server Error' });
        });
});
module.exports = router;