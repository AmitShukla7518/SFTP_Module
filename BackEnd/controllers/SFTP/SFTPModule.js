const express = require('express');
var router = express.Router();
var logger = require('../../config/winston');
require('custom-env').env(true)
const http_status = require('../../constants/http_status');
const utils = require('../SFTP/utilty');


router.get('/CallSFTP', async function (req, res, next) {

    let host = process.env.SFTPTOGO_URL;
    let username = process.env.username;
    let password = process.env.password;
    const port = 22;


    let FSTP = await utils.connect({ host, port, username, password });
    // console.log(ConnToServer);
    // res.send({ Massage: ConnToServer })
    res.send({ massage: FSTP })

    // //* List working directory files
   // await utils.listFiles(".");

    // //* Upload local file to remote file
    // await client.uploadFile("./local.txt", "./remote.txt");

    // //* Download remote file to local file
    // await client.downloadFile("./remote.txt", "./download.txt");

    // //* Delete remote file
    // await client.deleteFile("./remote.txt");

    // //* Close the connection
    // await client.disconnect();



})

module.exports = router