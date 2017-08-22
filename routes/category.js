/**
 * Created by Melody.Deng on 2017/1/9.
 */
var express = require('express');
var router = express.Router();
var uuid = require('node-uuid');
var checkLogin = require('./check').checkLogin;
var UserModel = require('../models/user').User;
var CategoryModel = require('../models/user').Category;
router.get('/',checkLogin,function (req,res) {
    res.render('category',{title:'分类管理'});
});

router.get('/getCategory',function (req,res) {
    CategoryModel.find({user_id:req.query.userId},function (err,data) {
        if(err){
            console.log(err.message);
        } else {
            UserModel.findOne({_id:req.query.userId},function (err,userData) {
                res.send({
                    success:1,
                    category:data,
                    user:userData,
                    allowAction:req.session.user&&req.query.userId==req.session.user._id
                });
            });
        }
    });
});

router.post('/save',function (req,res) {
    var category = {
        _id:uuid.v1(),
        parent_id:req.body.parent_id,
        name:req.body.name,
        user_id:req.session.user._id,
        is_manage:req.body.is_manage
    };
    CategoryModel.create(category,function (err) {
        if(err){
            console.log(err.message);
        }else{
            res.send({
                success:1,
                newCategory:category
            })
        }
    });
});

router.post('/edit',function (req,res) {
    var category = {
        _id:req.body._id,
        parent_id:req.body.parent_id,
        name:req.body.name,
        user_id:req.session.user._id,
        is_manage:req.body.is_manage
    };
    CategoryModel.update({_id:category._id},category,function (err) {
        if(err){
            console.log(err.message);
        }else{
            res.send({
                success:1
            })
        }
    });
});

router.post('/remove',function (req,res) {

    var categoryId = req.body.categoryId;
    CategoryModel.remove({_id:categoryId},function (err) {
        if(err){
            console.log(err.message);
        }else{
            res.send({
                success:1
            })
        }
    });
});

module.exports = router;