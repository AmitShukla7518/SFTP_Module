// const AWS = require('aws-sdk');
const bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');
var logger = require('../config/winston');

/**
 * 
 * @param {*} length Specify length of random string
 * @returns 
 */
exports.generateRandomText = function (length) {
    var result = '';
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}

exports.generateHashPwd = function (plainText) {
    return new Promise((resolve, reject) => {
        bcrypt.hash(plainText, Number(process.env.bcrypt_salt_round), function (err, hash) {
            resolve(hash)
        });
    })
}
exports.customExeption = function (message, statusCode) {
    this.message = message;
    this.statusCode = statusCode
}


/**
 * @function getDataByTableColumn
 * @param {*} table : table name where query will run.
 * @param {*} queryParams : column and value mapping that will be used in where clause.
 * @returns user data along with all meta data
 */
exports.getDataByTableColumn = async function (table, queryParams = {}) {
    let keys = Object.keys(queryParams)
    let whereClauseItems = []
    for (const iterator of keys) {
        let whereKey = `${iterator}='${queryParams[iterator]}'`
        whereClauseItems.push(whereKey)
    }
    let whereClause = whereClauseItems.join(' and ')
    let query = `select * from ${table} ${whereClause && whereClause.length > 0 ? `where ${whereClause}` : ''}`
    return query
}

/**
 * @function generateJWTToken
 * @param {*} data 
 * @param {*} secret 
 * @param {*} expiresIn 
 * @returns 
 */
exports.generateJWTToken = async function (data, secret = process.env.SECRET, expiresIn = process.env.tokenLife) {

   
        let tokenData = {
            "ID": data.id,
            "fName": data.fName,
            "Lname": data.Lname,
            "Email": data.Email,
            "userId": data.userId
        }

    let token = jwt.sign(tokenData, secret, { expiresIn })
    return token;

}


exports.generateJWTTokenforOTP = async function (data, secret = process.env.SECRET, expiresIn = process.env.tokenLife) {


    let token = jwt.sign(data, secret, { expiresIn })
    return token
}



/**
 * @function parseJWTToken
 * @param {*} data 
 * @param {*} secret 
 * @param {*} expiresIn 
 * @returns 
 */
exports.parseJWTToken = async function (token, secret = process.env.SECRET) {
    return new Promise((resolve, reject) => {
        jwt.verify(token, secret, async (err, result) => {
            if (err) {
                logger.info(`error occoured in token validation ${JSON.stringify(err)}`)
                reject(err)
            } else {
                resolve(result)
            }
        })
    })

}




/* Upload File on AWS server*/

// const s3 = new AWS.S3({
//     accessKeyId: process.env.AccessKeyId,
//     secretAccessKey: process.env.SecretAccessKey,
//     signatureVersion: 'v4'
// });

/**
 * @function uploadFileToS3AndGetUrl
 * @param {*} fileName,Bucket,Binary 
 * @returns File Locations
 */

// exports.uploadfileToS3AndGetUrl = function (fileName, bucket, binary) {
//     return new Promise((resolve, reject) => {
//         let buf = binary.data;
//         let fileType = binary.mimetype;
//         const params = {
//             Bucket: bucket,
//             Key: fileName,
//             Body: buf,
//             ContentType: fileType,
//             ACL: 'public-read'
//         };
//         let s3prom = s3.upload(params).promise()
//         s3prom.then(data => {
//             resolve(data.Location);
//         }).catch(err => {
//             reject(err);
//         })
//     })
// }

/*Genrate 6 Digit OTP Function */

/**
*@function generateOTP

*@returns 8 Digit Random
 */

exports.generateOTP = function (length) {

    var digits = '0123456789';
    let OTP = '';
    for (let i = 0; i < length; i++) {
        OTP += digits[Math.floor(Math.random() * 10)];
    }
    return OTP;
}




exports.generateUserSequence = function (tenant_code, prefix) {
    var query = `create sequence ${tenant_code}_${prefix}_seq
    start 1
    increment 1
    minvalue 1`
    return query
}

exports.comparePwd = function(clientPassword, serverPassword){
    return new Promise((resolve,reject)=>{
        try{            
            bcrypt.compare(clientPassword, serverPassword, function(err, res) {
                if(err){
                    logger.error('error occurred in password comparison due to =>', err);
                }
                resolve(res);
            });
        }
        catch(Exception) {
            logger.error("error occoured in comparing password due to : ", Exception);  
            reject(Exception)
        }
    })
}