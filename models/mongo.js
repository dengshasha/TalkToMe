/**
 * Created by Melody.Deng on 2016/11/18.
 */
var mongoose = require('mongoose');
var configlist = require('config-lite');
var db = mongoose.createConnection(configlist.mongo.connectionStr);//'localhost:27017/lotuskb'
db.on('error',console.error.bind(console,'连接错误'));
db.once('open',function () {
    console.log('连接成功');
});
/*在mongoose中，有三种模型
 * Schema:一种以文件形式存储的数据库模型骨架，不具备数据库的操作能力
 * Model:由Schema发布生成的模型，具有抽象属性和行为的数据库操作对
 * Entity:由Model创建的实体，它的操作也会影响数据库*/


var model= {
    init:function (table,schema) {
        return  db.model(table,schema);
    }
};

module.exports = model;