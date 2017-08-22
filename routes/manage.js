/**
 * Created by Melody.Deng on 2016/11/17.
 */
var express = require('express');
var router = express.Router();
var PostModel = require('../models/user').Post;
var UserModel = require('../models/user').User;
var DepartmentModel = require('../models/user').Department;
var Promise = require('bluebird');
router.get('/',function (req,res) {
    var currentUserId = req.query.userId;
    UserModel.findOne({_id:currentUserId},function (err,userData) {
        if(err){
            console.log(err.message);
        }else{
            res.render('manage',{
                title:'manage',
                currentUser:userData,
                allowAction:req.session.user&&userData.is_manage
            })
        }
    });
});
//文章列表
router.get('/manage-article',function (req,res) {
    res.render('templates/manage-article');
});
router.get('/manage-article/get-article',function (req,res) {
    var currentUserId = req.query.userId;
    if(req.session.user){
        var promise = UserModel.findOne({_id:req.session.user._id});
        promise.then(function (resolve) {
            var is_manage = resolve.is_manage;
            PostModel.find({authorId:currentUserId},function (err,postData) {
                if(err){
                    console.log("error",err.message);
                }else{
                    res.send({
                        postInfo:postData,
                        currentUserId:currentUserId,
                        allowAction:req.query.userId == req.session.user._id,
                        manageAction: is_manage
                    });
                }
            });
        });
    } else{
        PostModel.find({authorId:currentUserId},function (err,postData) {
            if(err){
                console.log("error",err.message);
            }else{
                res.send({
                    postInfo:postData,
                    currentUserId:currentUserId,
                    allowAction:false,
                    manageAction:false
                });
            }
        });
    }
});
//个人信息
router.get('/manage-user-info',function (req,res) {
    var currentUserId = req.query.userId;
    UserModel.findOne({_id:currentUserId},function (err,userData) {
        if(err){
            console.log("error",err.message);
        }else{
            DepartmentModel.findOne({_id:userData.departmentId},function (err,deData) {
                if(err){
                    console.log(err.message);
                }else{
                    res.render('templates/manage-user-info',{
                        userInfo:userData,
                        deInfo:deData
                    });
                }
            });
        }
    });
});
//个人分类
router.get('/manage-category',function (req,res) {
    res.render('templates/manage-category');
});

//用户管理
router.get('/manage-permissions',function (req,res) {
    UserModel.find({is_manage:false},function (err,data) {
       if(err){
           console.log(err);
       } else{
           res.render('templates/manage-permissions',{
               users:data
           });
       }
    });
});
module.exports = router;