const express = require('express');
var router = express.Router();
var logger = require('../../config/winston');
var jwt = require('jsonwebtoken');
require('custom-env').env(true)
const moment = require('moment-timezone');
const http_status = require('../../constants/http_status');
var conn = require('../../config/config');
const IP = require('ip');

router.post('/', async function (req, res, next) {
    try {
        const ipAddress = IP.address();
        res.send(ipAddress)
    } catch (error) {
        res.status(http_status.INTERNAL_SERVER_ERROR).send({ error: error.message });
    }
});

router.get('/', async function (req, res, next) {
    try {
        let query = "select * from expense_food";
        let Name = [];
        await conn.query(query, function (err, result) {
            if (err) throw err;
            //  res.send(result)
            result.map((item) => {
                Name.push(item.empName);
            })
            res.send(Name);
        })



    } catch (error) {
        res.status(http_status.INTERNAL_SERVER_ERROR).send({ error: error.message });
    }
});

module.exports = router;