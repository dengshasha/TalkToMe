/**
 * Created by Melody.Deng on 2016/11/11.
 */
module.exports = {
    checkLogin: function checkLogin(req,res,next) {
        if(!req.session.user){
            res.redirect('/check');
        }
        next();
    },
    checkNotLogin:function checkNotLogin(req,res,next) {
        if(req.session.user){
            req.flash('error','已登录');
            return res.redirect('back');
        }
        next();
    }
};