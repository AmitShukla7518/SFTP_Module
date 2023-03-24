const express = require('express');
var router = express.Router();
var logger = require('../../config/winston');
require('custom-env').env(true)
var conn = require('../../config/config');
var conn = require('../../config/config');
var { validateIp } = require('../auth/auth_utility');
const IP = require('ip');
const http_status = require('../../constants/http_status');




/**
 * Login using username/email and password
 */
router.post('/', async function (req, res, next) {
    try {

        if (validateIp(IP.address())) {
            let txt_usrId = req.body.txt_usrId;
            let txt_usr_pwd = req.body.txt_usr_pwd;
            if (txt_usrId.trim() == "CE03070003" || txt_usrId.trim() == "CE10091236") {
                // No Any Action required
            } else {
                /*Check Ip Address is exist in DB's Table */
                let query = `select distinct IP from whitelistedip  where IP = '${IP.address()}'`;
                // await conn.query(query, function (err, row) {
                //     if (err) throw err;
                //     if (row.length > 0 && row.length != 0) {
                //         // No Any Action required
                //     } else {
                //         res.status(http_status.FORBIDDEN).send({ status: "Failed", msg: "Ip Address does't Exist in DB" })
                //     }
                // });
            }

            query = `select count(*) from throttling_check where  try_time > NOW() - INTERVAL 60 second && emp_id ='${txt_usrId}'`;
            await conn.query(query, function (err, row) {
                if (err) throw err;
                if (row.length < 4) {
                    let query = `select userid,username,clientid from login_demo where userid='${txt_usrId}' and pwd='${txt_usr_pwd}'`;
                    conn.query(query, (err, row) => {
                        if (err) throw err;
                        res.send(row[2]);

                    });
                }
                else {
                    // Do Somethings
                }

            })

        } else {
            res.status(http_status.FORBIDDEN).send({ status: "Failed", msg: "You are not allowed to access this resource!" })
        }
    } catch (error) {

    }
});




module.exports = router;