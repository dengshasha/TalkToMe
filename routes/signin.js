/**
 * Created by Melody.Deng on 2016/11/8.
 */
var express = require('express');
var router = express.Router();

var userModel = require('../models/user').User;

var checkNotLogin = require('./check').checkNotLogin;

//GET /signin登录页
router.get('/',checkNotLogin,function (req,res,next) {
    res.render('signin',{title:'signin'});//渲染视图

});

//POST /signin登录
router.post('/',checkNotLogin,function (req,res,next) {
    var query = {
        username:req.body.username,
        password:req.body.password
    };
    (function () {
        userModel.count(query,function (err,doc) {
            if(doc == 1){
                userModel.findOne({username:query.username},function (err,data) {
                    if(err){
                        console.log(err);
                    }
                    else{
                        req.session.user = data;
                        setTimeout(function () {
                            res.redirect('/');
                        },200);
                    }
                });
            }else{
                req.flash('error','用户名或密码不正确');
                res.redirect('back');
            }
        })
    })(query);
});

module.exports = router;
