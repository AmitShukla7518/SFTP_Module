
var request = require('request');


exports.createAccountOpning = async function (data) {
    let insertQuery = 'INSERT INTO tbl_emp (Name,Address,MobileNo,Email) VALUES'
    for (const item of data) {
        insertQuery += `('${item.Name.toUpperCase()}','${item.Address.toUpperCase()}','${item.MobileNo}','${item.Email.toUpperCase()}'),`
    }
    insertQuery = insertQuery.replace(/,$/, ";")

    return insertQuery;
}

/**
 * @function checkDuplicacy
 * @param {*} Array_of_Object 
 * @returns Remove Duplicate Entry and Return Unique Elements
 */

exports.checkDuplicacy = async (data) => {
    var arrOfObj = data;
    var dataArr = arrOfObj.map(item => {
        return [item.userId, item]
    }); // creates array of array
    var maparr = new Map(dataArr); // create key value pair from array of array
    var result = [...maparr.values()];//converting back to array from mapobject
    return result;
}





//just fo executing http requests
exports.runRequest=function (options) {
    return new Promise(async function (resolve, reject) {
        try {
            await request(options, function (error, response, body) {
                if (error) {
                    
                    reject(error);
                } else {
                    resolve(body)
                }
            });
        } catch (error) {
            reject(error);
        }
    })
}
