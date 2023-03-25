const express = require('express');
var router = express.Router();
var logger = require('../../config/winston');
require('custom-env').env(true)
const http_status = require('../../constants/http_status');
const utils = require('../SFTP/utilty');
let Client = require('ssh2-sftp-client');


router.get('/CallSFTP', async function (req, res, next) {

    // let host = process.env.SFTPTOGO_URL;
    // let username = process.env.username;
    // let password = process.env.password;
    // const port = 22;

    let client = new Client();
    client.connect({
        host: process.env.SFTPTOGO_URL,
        port: '22',
        username: process.env.username,
        password: process.env.password,
        algorithms: {
          serverHostKey: [ 'ssh-dss' ],
          kex: ['diffie-hellman-group14-sha1'],
          cipher: ['aes128-cbc']
        }
    }).then(() => {
        sftp.put('./log.r', '/log.r', false);
    }).then((data) => {
        console.log(data, 'the data info');
    }).catch((err) => {
        console.log(err, 'catch error');  
    });





    // let FSTP = await utils.connect({ host, port, username, password });
    // // console.log(ConnToServer);
    // // res.send({ Massage: ConnToServer })
    // res.send({ massage: FSTP })

    // //List of Files
    // await utils.listFiles(".");

    // //Upload local file to remote file
    // await client.uploadFile("./local.txt", "./remote.txt");

    // // Download remote file to local file
    // await client.downloadFile("./remote.txt", "./download.txt");

    // // Delete remote file
    // await client.deleteFile("./remote.txt");

    // // Close the connection
    // await client.disconnect();



})

module.exports = router