/**
 * Created by Melody.Deng on 2016/11/18.
 */
var express = require('express');
var formidable = require('formidable');
var url = require('url');
var uuid = require('node-uuid');
var fs = require('fs');
var configlist = require('config-lite');
var Promise = require('bluebird');

var router = express.Router();
var PostModel = require('../models/user').Post;
var UserModel = require('../models/user').User;
var CategoryModel = require('../models/user').Category;

var checkLogin = require('./check').checkLogin;

//获取日期
var date = new Date();
var year = date.getFullYear();
var month = date.getMonth() + 1;
month = month > 9 ? month : '0' + month;
var day = date.getDate();
day = day > 9 ? day : '0' + day;
var hour = date.getHours();
hour = hour > 9 ? hour : '0' + hour;
var minute = date.getMinutes();
minute = minute > 9 ? minute : '0' + minute;
var nowDate = year + '-' + month + '-' + day + ' ' + hour + ':' + minute;

router.get('/',checkLogin,function (req,res) {
    res.render('post', {title:'post'});
});
router.get('/getCategory',function (req,res) {
    CategoryModel.find({user_id:req.session.user._id},function (err,data) {
        if(err){
            console.log(err.message);
        } else {
            UserModel.findOne({_id:req.session.user._id},function (err,userData) {
                res.send({
                    success:1,
                    category:data,
                    user:userData
                });
            });
        }
    });
});
//上传图片
router.post('/imgupload',function (req,res) {
    var form = new formidable.IncomingForm();
    form.uploadDir = './public/uploadtmp';//改变临时存放目录
    form.parse(req,function (err,fields,files) {
        for(var item in files){
            var file = files[item];
            var filename = (new Date()).getTime();
            switch (file.type){
                case "image/jpeg":
                    filename = filename + '.jpg';
                    break;
                case "image/png":
                    filename = filename + '.png';
                    break;
                default:
                    filename = filename + '.png';
                    break;
            }
        }

        var uploadDir = './public/uploadimg/' + filename;
        fs.rename(file.path,uploadDir,function (err) {
            if(err){
                res.write(err);
                res.end();
            }
            res.send(configlist.webBaseUrl + "/uploadimg/" + filename);       // 上传成功时才返回;
        })
    })
});

//保存文章
router.post('/',checkLogin,function (req,res,next) {
    // var tags = req.body.tags;
    // var tagsArr = tags.split(",");
    // var tagsList = [];
    // for(var i = 0;i < tagsArr.length;i ++){
    //     if(tagsArr[i] != ""){
    //         tagsList.push(tagsArr[i]);
    //     }
    // }

    UserModel.findOne({_id:req.session.user._id},function (err,data) {
        var isManage = data.is_manage;
        var post = {
            _id:uuid.v1(),
            authorId:req.session.user._id,
            authorName:req.session.user.username,
            title:req.body.title,
            content:req.body.content,
            editorValue:req.body.editor_value,
            mkContent:req.body.mk_content,
            categoryId:req.body.categoryId,
            categoryName:req.body.categoryName,
            time:nowDate,
            isManage:isManage
        };
        PostModel.create(post,function (err) {
            if(err){
                res.send({
                    success:0,
                    error:err
                });
            }else{
                res.send({
                    success:1,
                    id:post._id
                });
            }
        });
    });
});




//删除文章
router.post('/remove',function (req,res) {
    var postId = req.body.postId;
    PostModel.remove({_id:postId},function (err) {
        if(err){
            console.log(err);
            res.send({
                success:0,
                error:err
            })
        }else{
            res.send({
                success:1
            })
        }
    })
});

//编辑
router.get('/edit',checkLogin,function (req,res,next) {
    var postId = req.query.id;
    var isManage = req.query.isManage;
    PostModel.findOne({_id: postId})
        .then(function (post) {
            if(!post){
                console.log('该文章不存在!');
            }else{
                if(post.editorValue == "html"){
                    res.render('edit',{
                        post:post,
                        isManage:isManage,
                        title:'编辑'
                    });
                }
                if(post.editorValue == "markdown"){
                    res.render('edit-markdown',{
                        post:post,
                        isManage:isManage,
                        title:'编辑'
                    });
                }
            }
        })
        .catch(next);
});
router.get('/edit/getInfo',function (req,res) {
    PostModel.findOne({_id: req.query.id},function (err,postData) {
        if(err){
            console.log(err.data);
        }else{
            res.send({
                success:1,
                post:postData
            });
        }
    })
});
//保存修改
router.post('/edit',function (req,res) {
    UserModel.findOne({_id:req.session.user._id},function (err,data) {
        var isManage = data.is_manage;
        var post = {
            _id:req.body.postId,
            authorId:req.session.user._id,
            authorName:req.session.user.username,
            title:req.body.title,
            content:req.body.content,
            editorValue:req.body.editor_value,
            mkContent:req.body.mk_content,
            categoryId:req.body.categoryId,
            categoryName:req.body.categoryName,
            time:nowDate,
            isManage: isManage
        };
        PostModel.update({_id:post._id},post,function (err) {
            if(err){
                console.log(err.message);
            }else{
                res.send({
                    success:1,
                    id:post._id
                });
            }
        })
    });
});

module.exports = router;