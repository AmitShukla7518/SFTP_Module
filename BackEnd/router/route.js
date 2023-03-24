const express = require('express');
const router = express.Router();

const logger = require('../config/winston');

/*   user_activity is just acting like an intercepter for keeping user history */

const login = require('../controllers/auth/login');
const signup  = require('../controllers/auth/signup');
const Learn  = require("../controllers/Learning/Learn")
const User_Controller = require('../controllers/Comman_Controller/user');
const SFTP = require('../controllers/SFTP/SFTPModule')
router.use('/login', login);
router.use('/signup', signup);
router.use('/Learnings', Learn)
router.use('/user', User_Controller)
router.use('/SFTP', SFTP)

/**
 * Invalid API endpoints request goes here
*/

router.use('/', async function (req, res) {
    try {
        res.status(200).send(`Welcome To EMS API`);
    } catch (err) {
        res.status(400).send("EMS API Endpoint You Are Trying To Reach Doesn't Exist");
    }
})

module.exports = router;