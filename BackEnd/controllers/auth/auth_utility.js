var logger = require('../../config/winston');
const http_status = require('../../constants/http_status');
const { customExeption } = require('../../utils/utils');
const bcrypt = require('bcryptjs');
const IP = require('ip');
var validateIP = require('validate-ip-node');

exports.validateSocialLogin = function (req, res, next) {
    try {
        const { social_id, email, source } = req.body;
        if (!social_id) {
            throw new customExeption('Missing Login ID.', http_status.BAD_REQUEST)
        } else if (!email) {
            throw new customExeption('Missing Email ID.', http_status.BAD_REQUEST)
        } else if (!source) {
            throw new customExeption('Missing Source.', http_status.BAD_REQUEST)
        } else {
            next();
        }
    } catch (error) {
        logger.error(`SOCIAL_LOGIN validation using ${req.body.source} :- ${JSON.stringify(req.body)} , due to : `, error);
        res.status(error.statusCode ? error.statusCode : http_status.INTERNAL_SERVER_ERROR).send({
            status: "failed",
            message: error.message ? error.message : error
        });
    }
}
exports.generateHashPwd = function (password) {
    return new Promise((resolve, reject) => {
        bcrypt.hash(password, process.env.bcrypt_salt_round, function (err, hash) {
            resolve(hash)
        });
    })
}

exports.comparePwd = function (clientPassword, serverPassword) {
    return new Promise((resolve, reject) => {
        try {
            bcrypt.compare(clientPassword, serverPassword, function (err, res) {
                if (err) {
                    logger.error('error occurred in password comparison due to =>', err);
                }
                resolve(res);
            });
        }
        catch (Exception) {
            logger.error("error occoured in comparing password due to : ", Exception);
            reject(Exception)
        }
    })
}

/**
     * Check  Valid IP Address and Return true or false
     * @param ipAddress
     * @return return True if Ip address is Valid otherwise false=.
     */
exports.validateIp = (ipAddress) => {
    let isValidIp = validateIP(ipAddress);
    return isValidIp;
}