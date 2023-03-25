const express = require('express');
var router = express.Router();
var logger = require('../../config/winston');
require('custom-env').env(true)
var conn = require('../../config/config');
const http_status = require('../../constants/http_status');
const utils = require("./utils")
var jsonFile = require('./response_json.json')




router.get('/Pagination', async function (req, res, next) {
    try {
        logger.info(`call received to get chart accounts and the request recieved is`)

        let url = "https://jsonplaceholder.typicode.com/todos"

        var options = {
            method: 'GET',
            url: url,
            headers: {
                'cache-control': 'no-cache',
                'Accept': '*/*',
            }
        };

        const response = await utils.runRequest(options)

        if (response && response.status == "failed") {
            throw new Error(response.message)
        }
        let insertQuery = await utils.createAccountOpning(jsonFile);
        conn.query(insertQuery, (err, result) => {
            if (err) throw err;
            res.status(http_status.OK).send(result.message);
        })
    } catch (error) {
        logger.error(`Failed to create chart account :- ${JSON.stringify(req.body)} , due to : `, error);
        res.status(http_status.BAD_REQUEST).send({
            status: "failed",
            message: error.message ? error.message : error
        });
    }

});




module.exports = router

