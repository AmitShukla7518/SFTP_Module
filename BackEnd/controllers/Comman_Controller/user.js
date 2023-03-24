const express = require('express');
var router = express.Router();
var logger = require('../../config/winston');
require('custom-env').env(true)
var conn = require('../../config/config');
const http_status = require('../../constants/http_status');
const reader = require('xlsx');
const { json } = require('body-parser');
const utils = require('../../utils/utils');
const { end, query } = require('../../config/config');
const checkToken = require('../middilware/checkToken')
const Validation = require('../../utils/validation/validation')

router.post('/signUp', async (req, res, next) => {
    let hashPass = await utils.generateHashPwd(req.body.pass);
    let random = await utils.generateOTP(8);
    let empId = `CE${random}`
    let query = `insert into userSignUp(fName,Lname,Email,userId,pass) values('${req.body.fName}','${req.body.Lname}','${req.body.Email}','${empId}','${hashPass}');`;
    conn.query(query, async (err, result) => {
        if (err) throw err;
        res.status(http_status.OK).send({ Message: `Your UserId is:- ${empId}` });
    })

})
router.post('/login', async (req, res) => {
    try {

        if (!Validation.isValid(req.body.userId)) {
            return res.status(http_status.BAD_REQUEST).send({ status: false, message: "Please provide Valid UserId or Email 🛑" });
        }
        if (!Validation.isValid(req.body.Pass)) {
            return res.status(http_status.BAD_REQUEST).send({ status: false, message: "Please provide Password 🛑" });
        }
        let query = `select * from userSignUp  where email = '${req.body.userId}' or userId ='${req.body.userId}' limit 1;`
        conn.query(query, async (err, result) => {
            if (err) throw err;
        if (result.length>0) {
            let passwordMatch = await utils.comparePwd(req.body.Pass, result[0].pass)
            if (!passwordMatch) return res.status(http_status.BAD_REQUEST).send({ message: "invalid username or password 🛑" });
            let jwtToken = await utils.generateJWTToken(result[0], process.env.SECRET, process.env.tokenLife)
            // Store Refresh Token
            let RefreshToken = utils.generateRandomText(50);
            var StoreToken = `UPDATE userSignUp SET refreshToken ='${RefreshToken}' where email = '${req.body.userId}' or userId ='${req.body.userId}'`;
            conn.query(StoreToken, async (err, result) => {
                if (err) throw err;
            })
            res.status(http_status.OK).send({ JWT_Token: jwtToken, Refresh_Token: RefreshToken });
        }else{
            res.status(http_status.BAD_REQUEST).send({ status: false, message: "Please provide Valid UserId or Email 🛑" });
        }
        })

    } catch (error) {
        res.status(http_status.BAD_REQUEST).send({ msg:"something went wrong" });
        console.log(error);
    }
})


router.post('/AddEmp/:UserId', checkToken, async (req, res) => {
    try {
        let checkRefreshToken = `select refreshToken from userSignUp where userID='${req.params.UserId}' and refreshToken IS NOT NULL`

        conn.query(checkRefreshToken, async (err, result) => {
            if (result[0].refreshToken === req.body.refreshToken) {
                if (!Validation.isValid(req.body.Name)) {
                    return res.status(http_status.BAD_REQUEST).send({ status: false, message: "Please provide Valid Name 🛑" });
                }
                if (!Validation.isValid(req.body.Address)) {
                    return res.status(http_status.BAD_REQUEST).send({ status: false, message: "Please provide Address 🛑" });
                }
                if (!Validation.isValidmob(req.body.MobileNo)) {
                    return res.status(http_status.BAD_REQUEST).send({ status: false, message: "Please provide Valid MobileNo 🛑" });
                }
                if (!Validation.isValidEmail(req.body.Email)) {
                    return res.status(http_status.BAD_REQUEST).send({ status: false, message: "Please provide Email Address 🛑" });
                }
                //Genrate Employee ID;
                let random = await utils.generateOTP(8);
                let empId = `CE${random}`
                let Data = [
                    req.body.Name, req.body.Address, req.body.MobileNo, req.body.Email, empId
                ]
                let checkmobile = 0;
                let checkMob = `select *from tbl_emp where MobileNo = ${req.body.MobileNo};`
                await conn.query(checkMob, async (err, result) => {
                    if (err) throw err;
                    if (result.length > 0) {
                        return res.status(http_status.BAD_REQUEST).send({ message: "This Mobile No  Already Exist in Database 🛑", status: "failed" });
                    }

                    let checkEmail = `select *from tbl_emp where Email = '${req.body.Email}';`
                    await conn.query(checkEmail, async (err, result) => {
                        if (err) throw err;
                        if (result.length > 0) {
                            return res.status(http_status.BAD_REQUEST).send({ message: "This Email is Already Exist in Database 🛑", status: "failed" });
                        }
                        else {
                            let query = 'insert into tbl_emp(Name,Address,MobileNo,Email,EmployeeId)values(?,?,?,?,?);'
                            conn.query(query, Data, async (err, result) => {
                                if (err) throw err;
                                res.status(http_status.OK).send({ Message: `Created Success` });
                            })
                        }
                        var deleteToken = `UPDATE userSignUp SET refreshToken ='Null' where  userID='${req.params.UserId}'`;
                        conn.query(deleteToken, Data, async (err, result) => {
                            //  if (err) throw err;
                            //res.status(http_status.OK).send({ Message: `Created Success` });
                        })
                    })

                })
            } else {
                res.status(http_status.BAD_REQUEST).send({ status: "failed", message: "Refresh Token Expired 🛑 " });
            }
        })

    } catch (error) {
        console.log(error);
    }
});

module.exports = router;