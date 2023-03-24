const express = require('express');
const app = express()
require('custom-env').env(true)
const port = process.env.port;
const bodyParser = require('body-parser')
const routes = require('./router/route');
const cors = require('cors');
var fileupload = require("express-fileupload");
var logger = require('./config/winston');



// const swaggerSpecs = swaggerJsdoc(swaggerOptions);

app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true, parameterLimit: 1000000 }));
app.use(fileupload());

var originsWhitelist = [
    'http://localhost:*',    //this is my front-end url for development
    'http://localhost:4200', // This is For  LOCAL Use
    '*'
];
var corsOptions = {
    origin: function (origin, callback) {
        var isWhitelisted = originsWhitelist.indexOf(origin) !== -1;
        callback(null, isWhitelisted);
    },
    credentials: true
}
//here is the magic
app.use(cors(corsOptions))


// app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(function (req, res, next) {
    //set headers to allow cross origin request.
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With,Authorization,Referer,User-Agent, Content-Type, Accept");
    res.header('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, OPTIONS');
    next();
});
const swaggerUi = require('swagger-ui-express')
const swaggerDocument = require('./config/swagger.json');
// const planSwagger = require('./utils/swagger/plan');
const loginSwagger = require('./utils/swagger/login');
const { generateSwaggerObject } = require('./swagger');

swaggerDocument.host = process.env.swaggerHost
swaggerDocument.paths = {
    ...swaggerDocument.paths,
    // ...planSwagger.paths,
    ...loginSwagger.paths
}

swaggerDocument.definitions = {
    ...swaggerDocument.definitions,
    // ...planSwagger.definitions,
    ...loginSwagger.definitions
}
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use('/', routes);

app.get('/', (req, res) => res.status(200).send('Welcome to Ac API'));

var server = app.listen(port, () => {
    logger.info(`App running on port ${port}.`);
})

generateSwaggerObject()
//response time out(5 minutes -->> 300 seconds -->> 300000 milliseconds)
server.timeout = 300000;