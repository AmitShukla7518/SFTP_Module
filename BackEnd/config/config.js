var mysql = require('mysql');

var con = mysql.createConnection({
    host: process.env.EMS_HOST,
    user: process.env.EMS_USER,
    password: process.env.EMS_PASS,
    database: process.env.EMS_DB,
    min: 100,
    max: 500, // no large number for better performance
    idleTimeoutMillis: 300000, // 10 seconds for idle client where default is 100 seconds
    connectionTimeoutMillis: 500000 // defined 10 seconds timeout for connection failure : default is no timeout
});

con.connect(function (err) {
    if (err) throw err;
    console.log(" !! Connected to Database !!");
});

module.exports = con;