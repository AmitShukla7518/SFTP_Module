const swaggerAutogen = require('swagger-autogen')()
const doc = {
    "swagger": "2.0",
    "info": {
        "description": " EMS Management API",
        "version": "1.0.0",
        "title": "EMS Management API"
    },
    "schemes": [
        "http","https"
    ],
    "host": "localhost:2228",
    "basePath": "/",
    "tags": [
        {
            "name": "login"
        },
        {
            "name": "plans"
        }
    ],
    "paths": {},
    "definitions": {}
}
const outputFile = './config/swagger.json'
const endpointsFiles = ['./main.js']

swaggerAutogen(outputFile, endpointsFiles, doc).then(() => {
})

exports.generateSwaggerObject = function (params) {
    swaggerAutogen(outputFile, endpointsFiles, doc).then(() => {
    })
}