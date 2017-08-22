/**
 * Created by Melody.Deng on 2016/11/24.
 */
var express = require('express');
var router = express.Router();
var fs = require('fs');
var configlist = require('config-lite');

router.post("/imgupload",function (req,res,next) {
    var chunks = [];
    var size = 0;
    req.on('data' , function(chunk){
        chunks.push(chunk);
        size+=chunk.length;
    });
    req.on("end",function(){
        var buffer = Buffer.concat(chunks , size);
        if(!size){
            res.writeHead(404);
            res.end('');
            return;
        }
        var rems = [];
        //根据\r\n分离数据和报头
        for(var i=0;i<buffer.length;i++){
            var v = buffer[i];
            var v2 = buffer[i+1];
            if(v==13 && v2==10){
                rems.push(i);
            }
        }
        //图片信息
        var picmsg_1 = buffer.slice(rems[0]+2,rems[1]).toString();
        var filename = picmsg_1.match(/filename=".*"/g)[0].split('"')[1];
        //图片数据
        var nbuf = buffer.slice(rems[3]+2,rems[rems.length-2]);

        var path = './public/uploadimg/' + filename;

        fs.writeFileSync(path , nbuf);

        console.log("保存"+filename+"成功");
        res.send({
            success :1,          // 0 表示上传失败，1 表示上传成功
            url:  configlist.webBaseUrl + "/uploadimg/" + filename        // 上传成功时才返回
        });
        res.end('error');
    });
});
module.exports = router;
