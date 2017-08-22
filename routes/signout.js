/**
 * Created by Melody.Deng on 2016/11/11.
 */
var express = require('express');
var router = express.Router();

var checkLogin = require('./check').checkLogin;

//GET /signout登出页
router.get('/',checkLogin,function (req,res) {
    req.session.user = null;
    res.send({
        success:1
    })
});
module.exports = router;
