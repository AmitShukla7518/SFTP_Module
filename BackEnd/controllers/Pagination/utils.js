var request = require('request');



exports.createAccountOpning = async function (data) {
    let insertQuery = 'INSERT INTO test_pagination (userId,Id,title,completed) VALUES'
    for (const item of data) {
        insertQuery += `('${item.userId}','${item.id}','${item.title}','${item.completed}'),`
    }
    insertQuery = insertQuery.replace(/,$/, ";")

    return insertQuery;

}


//just fo executing http requests
exports.runRequest = function (options) {
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
