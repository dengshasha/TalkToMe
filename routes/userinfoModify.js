/**
 * Created by Melody.Deng on 2016/11/19.
 */
var express = require('express');
var router = express.Router();

var userInfo = require('../models/user').User;

var checkLogin = require('./check').checkLogin;

router.get('/',checkLogin,function (req,res) {
    res.render('userinfoModify',{title:'修改用户信息'});

});

router.post('/',checkLogin,function (req,res,next) {

    var nickname = req.body.nickname;
    var gender = req.body.gender;
    var duties = req.body.duties;
    var signature = req.body.signature;
    var avator = req.body.avator;

    var newUser = {
        nickname:nickname,
        gender:gender,
        duties:duties,
        signature:signature,
        avator:avator
    };

    userInfo.update(newUser,function (err) {
        if(err){
            console.log(err);
            res.send({
                success:0,
                error:err
            });
        }else{
            req.session.user = newUser;
            console.log(newUser);
            res.send({
                success:1
            });
        }
    })
});

module.exports = router;