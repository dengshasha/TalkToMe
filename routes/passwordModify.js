/**
 * Created by Melody.Deng on 2016/12/2.
 */
var express = require('express');
var router = express.Router();

var userModel = require('../models/user').User;

router.get('/',function (req,res) {
   res.render('passwordModify',{
       title:'修改密码'
   })
});
router.post('/',function (req,res) {
    var password = req.body.password;
    var user = req.session.user;
    console.log(user);
    userModel.update({_id:user._id},{$set:{password:password}},function (err,data) {
       if(err){
           console.log(err.message);
           res.send({
               success:0
           })
       } else{
           res.send({
               success:1
           })
       }
    });
});

module.exports = router;