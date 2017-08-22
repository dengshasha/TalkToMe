var express = require('express');
var checkNotLogin = require('./check').checkNotLogin;


/* GET home page. */
module.exports = function (app) {
  app.get('/guide',function (req,res) {
      res.render('guide',{title:'引导'});
  });
  app.use('/',require('./main'));
  /*检查用户是否登录*/
  app.get('/check',checkNotLogin,function (req,res) {
      res.render('check',{title:'check'});
  });

  app.use('/manage',require('./manage'));/*个人中心*/
  app.use('/userinfoModify',require('./userinfoModify'));/*修改用户信息*/
  app.use('/signin',require('./signin'));/*登录*/
  app.use('/signout',require('./signout'));/*退出登录*/
  app.use('/post',require('./post'));/*发表文章--html编辑器*/
  app.use('/post-markdown',require('./post-markdown'));/* 发表文章--Markdown编辑器 */
  app.use('/article',require('./article'));//文章详情
  app.use('/passwordModify',require('./passwordModify'));//修改密码
  app.use('/category',require('./category'));//分类管理
};
