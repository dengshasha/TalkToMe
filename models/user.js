/**
 * Created by Melody.Deng on 2016/11/17.
 */
var mongo = require('./mongo');
/*用户登录信息*/
var UserSchema = {
    username:{type:String},
    password:{type:String},
    nickname:{type:String},/*昵称*/
    avatar :{type:String},/*头像*/
    departmentId:{type:String},/*部门ID*/
    is_manage:{type:Boolean}
};
/*发表文章信息*/
var PostSchema = {
    _id:{type:String},
    authorId:{type:String},
    authorName:{type:String},
    title:{type:String},
    content:{type:String},
    mkContent:{type:String},//markdown编辑器的源码
    time:{type:String},
    categoryId:{type:String}, //技术分类
    categoryName:{type:String},
    editorValue:{type:String}, //编辑器标识
    isManage:{type:Boolean}//文章权限
};
var CategorySchema = {
    _id:{type:String},
    parent_id:{type:String},
    user_id:{type:String},
    is_manage:{type:Boolean},
    name:{type:String}
};
var DepartmentSchema = {
    _id:{type:String},
    name:{type:String}
};

exports.User = mongo.init('users',UserSchema);
exports.Post = mongo.init('posts',PostSchema);
exports.Category = mongo.init('category',CategorySchema);
exports.Department = mongo.init('departments',DepartmentSchema);



