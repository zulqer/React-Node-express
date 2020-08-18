var express = require('express');
var router = express.Router();
var user = require("../controllers/User.js");
/* GET users listing. */

router.post('/signup', user.signup);
router.post('/login', user.login);
module.exports = router;
