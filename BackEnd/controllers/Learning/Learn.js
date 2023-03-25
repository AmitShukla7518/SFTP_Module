const express = require('express');
var router = express.Router();
var logger = require('../../config/winston');
require('custom-env').env(true)
var conn = require('../../config/config');
var { validateIp } = require('../auth/auth_utility');
const http_status = require('../../constants/http_status');
const reader = require('xlsx');
const { json } = require('body-parser');
const utils = require("./utilty")
const fs = require("fs")//npm install fs
// const jsonFile = require("./response_json.json")
const exceljs = require('exceljs')



// Work On Excel File and Insert Bulk Data into DB and check Data Duplicacy (Import Data)

router.post('/importExcel', async function (req, res) {
    try {
        let exlFile = req.files.excelFile;

        const file = reader.read(exlFile.data)
        let data = []
        let jsonData = []
        const sheets = file.Sheets["Sheet1"]
        data = reader.utils.sheet_to_json(sheets);
        let headers = data.map((item) => Object.keys(item));
        for (let i = 0; i < 1; i++) {
            headers = headers[i];
        }

        data.map((item) => {
            jsonData.push(item);
        })
        let ExcelDatalength = jsonData.length;
        let checkDup = await utils.checkDuplicacy(jsonData);
        let UniqueDataLength = checkDup.length;
        let insertQuery = await utils.createAccountOpning(checkDup);

        await conn.query(insertQuery, (err, result) => {
            if (err) throw err;
            let responce = {
                Error_Msg: `${ExcelDatalength - UniqueDataLength} Duplicate Entry Found !!`,
                Massage: `${UniqueDataLength} Record has been Save successfully In Database !!`
            }
            res.status(http_status.OK).send(responce);
        })
    } catch (error) {
        logger.error(error);
    }
});



/*Export Data JSON To Excel*/




router.get('/exportExcel', async (req, res) => {
    try {
        let Data = jsonFile;
        const workBook = new exceljs.Workbook()
        const sheet = workBook.addWorksheet('firstNodeSheets')
        sheet.columns = [
            { header: "id", key: "id" },
            { header: "Name", key: "Name" },
            { header: "MobileNo", key: "MobileNo" },
            { header: "Email", key: "Email" },
            { header: "EmployeeId", key: "EmployeeId" },
            { header: "created_at", key: "created_at" },
            { header: "Sr.No", key: "Sr.No" }
        ]

        // sheet.columns = [
        //     { header: "SrNo", key: "SrNo" },
        //     { header: "userId", key: "userId" },
        //     { header: "title", key: "title" },
        //     { header: "completed", key: "completed" }
        // ]
        let counter = 0;

        let sql = "select *from tbl_emp";
        conn.query(sql, (err, result) => {
            if (err) throw err;
            result.map(item => {
                counter++;
                item.s_no = counter;
                console.log(item);
                sheet.addRow(item);
            })


            sheet.getRow(1).eachCell((cell) => {
                //cell.font = "bold";
                cell.font = { bold: true };
            })
            res.setHeader(
                "content-type",
                "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
            )
            res.setHeader("content-disposition", `attachment; filename=users.xlsx`)
            return workBook.xlsx.write(res);
        })

    } catch (error) {
        console.log(error);
    }
})





















// Call External APi From NodeJS(Express )

router.get('/dummyData', async function (req, res, next) {
    try {
        logger.info(`call received to get chart accounts and the request recieved is`)

        let url = "https://jsonplaceholder.typicode.com/todos"

        var options = {
            method: 'GET',
            url: url,
            headers: {
                'cache-control': 'no-cache',
                'Accept': '*/*',
            }
        };

        const response = await utils.runRequest(options)

        if (response && response.status == "failed") {
            throw new Error(response.message)
        }

        res.status(http_status.OK).send(response);

    } catch (error) {
        logger.error(`Failed to create chart account :- ${JSON.stringify(req.body)} , due to : `, error);
        res.status(http_status.BAD_REQUEST).send({
            status: "failed",
            message: error.message ? error.message : error
        });
    }

});












module.exports = router
