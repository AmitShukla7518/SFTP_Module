var jwt = require('jsonwebtoken');



const VarifyToken = async (req, res, next) => {
    try {
        let token = req.headers.authorization;
        let DecodeToken = await jwt.verify(token, process.env.SECRET, process.env.tokenLife)
        if (!DecodeToken) {
            return res.status(400).send({ status: false, msg: "Token is Invalid" })
        }
        else {
            console.log("Token  Varifyed Successfully");
        }
        next()
    }
    catch (err) {
        res.status(400).send({ status: false, Error: err.message })
        console.log(err);
    }

}
module.exports = VarifyToken;