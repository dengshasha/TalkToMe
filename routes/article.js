/**
 * Created by Melody.Deng on 2016/11/25.
 */
var express = require('express');
var PostModel = require('../models/user').Post;
var UserModel = require('../models/user').User;
var CategoryModel = require('../models/user').Category;
var router = express.Router();

router.get('/',function (req,res) {
    global.postId = req.query.id;
    PostModel.findOne({_id:postId},function(err,post){
        if(err){
            console.log('error',err.message);
        }else{
            var postUserId = post.authorId;
            UserModel.findOne({_id:postUserId},function (err,postUser) {
                if(err){
                    console.log(err);
                }else{
                    res.render('article',{
                        title:'文章详情',
                        post:post,
                        postUser:postUser
                    });
                }
            });
        }
    });

});

//获取分类详情
router.get('/getCategory',function (req,res) {
    CategoryModel.find({user_id:req.query.userId},function (err,categoryData) {
        if(err){
            console.log(err.message);
        } else {
            PostModel.find({authorId:req.query.userId},function (err,postData) {
                res.send({
                    success:1,
                    category:categoryData,
                    post:postData
                });
            });

        }
    });
});
//文章列表
router.get('/article-detailed',function (req,res) {
    PostModel.findOne({_id:req.query.id},function (err,data) {
        if(err){
            console.log(err.message);
        }else{
            res.render('templates/article-detailed',{
                post:data,
                allowAction:req.session.user&&req.query.username==req.session.user.username
            });
        }
    });

});
module.exports = router;