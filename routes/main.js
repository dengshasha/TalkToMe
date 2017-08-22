/**
 * Created by Melody.Deng on 2016/12/7.
 */
var express = require('express');
var router= express.Router();
var PostModel = require('../models/user').Post;
var UserModel = require('../models/user').User;
var CategoryModel = require('../models/user').Category;
var Promise = require('bluebird');

router.get('/',function (req,res) {
    res.render('main',{title:'main'});
});

router.get('/getCategory',function (req,res) {
    CategoryModel.find({is_manage:true},function (err,categoryData) {
       if(err){
           console.log(err.message);
       } else {
           PostModel.find({isManage:true},function (err,postData) {
               res.send({
                   success:1,
                   category:categoryData,
                   post:postData
               });
           });
       }
    });
});


//获取技术下的文章列表
/*router.get('/classification',function (req,res,next) {
    var classificationValue = req.query.claName;
    PostModel.find({classification:classificationValue},function (err,postsData) {
        if(err){
            console.log(err.message);
        }else{

            var userList = [];
            for(var i = 0 ; i < postsData.length ; i++){
                var userData = UserModel.find({username:postsData[i].author_name});
                userList.push(userData);
                UserModel.find({username:postsData[i].author_name},function (err,userData) {
                    if(err){
                        console.log(err);
                    }else {
                        console.log('------------------');
                        userList.push(userData);
                    }
                });
            }
            Promise.all(userList).then(function () {
                console.log(userList);
                res.render('templates/main-classification',{
                    posts:postsData,
                    users:userList
                });
            });
        }
    })
});*/

//搜索
router.get('/search',function (req,res,next) {
    var keywords = req.query.keywords;
    var reg = new RegExp(keywords,'i');//不区分大小写
    PostModel.find({$and:[{isManage:'true'},{$or:[{content:{$regex:reg}}, {title:{$regex:reg}}]}]},
        function (err,data) {
            if(err){
                console.log(err.message);
            } else {
                console.log(data);
                res.send({
                    success: 1,
                    searchResult: data
                })

        }
    })
});

module.exports = router;