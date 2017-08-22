/**
 * Created by Melody.Deng on 2017/1/20.
 */
var app = new Vue({
    el:"#all",
    data:{
        article:'',//文章
        user:'',//用户
        category:'',//分类
        userId:userId,
        postId:postId,
        promptTitle:'',
        promptBody:''
    },
    mounted:function () {
        var $this = this;
        var editormdView;
        editormdView = editormd.markdownToHTML('mk-content',{
            htmlDecode      : "style,script,iframe",  // you can filter tags decode
            emoji           : true,
            taskList        : true,
            tex             : true,  // 默认不解析
            flowChart       : true,  // 默认不解析
            sequenceDiagram : true,  // 默认不解析
        });

        $this.getCategory();
    },
    methods:{
        //将分类按层级结构保存
        addChildrenNav:function(targetList,originList,id) {
            var $this = this;
            for (var i = 0; i < originList.length; i++) {
                if (originList[i].parent_id == id) {
                    originList[i].text=originList[i].name;
                    targetList.push(originList[i]);
                    targetList[targetList.length-1].nodes=[];
                    $this.addChildrenNav(targetList[targetList.length-1].nodes, originList, targetList[targetList.length-1]._id);
                }
            }
        },

        getCategory:function () {
            var $this = this;
            $.ajax({
                url:'/article/getCategory',
                type:'get',
                data:{
                    userId: $this.userId
                },
                success:function (data) {
                    var result = [];
                    if(data.post!=null&&data.post.length>0){
                        data.post.forEach(function (item,index) {
                            item.parent_id=item.categoryId;
                            item.name=item.title;
                            item.catType='article';
                            data.category.push(item);
                        })
                    }

                    $this.addChildrenNav(result,data.category,0);
                    $this.category = result;
                    $("#tree").treeview({
                        data:$this.category,
                        collapseIcon:'glyphicon glyphicon-folder-open',//列表未展开时的图标
                        expandIcon:'glyphicon glyphicon-folder-close',//列表展开时的图标
                        showBorder:false,//是否有边框
                        onNodeSelected: function(event, data) {
                            //某个节点被选中时触发
                            if(data.catType){
                                $("#article-detailed").load('article/article-detailed?id='+ data._id + '&username='+data.authorName);
                            }
                        }
                    });
                },
                error:function (data) {
                    console.log(data);
                }
            });
        },
        //删除文章
        removeArticle:function () {
            var $this = this;
            $.ajax({
                url:'/post/remove',
                type:'post',
                data:{postId:$this.postId},
                success:function () {
                    $("#remove").modal('hide');
                    $("#prompt").modal('show');
                    $this.promptTitle = '提示';
                    $this.promptBody = '删除成功，正在跳转...';
                    var random = Math.random();
                    setTimeout(function () {
                        window.location.href = url + "/manage?userId=" + $this.userId + '&' + random;
                    },1000);

                },
                error:function (data) {
                    $("#remove").modal('hide');
                    $("#prompt").modal('show');
                    $this.promptTitle = '错误提示';
                    $this.promptBody = '删除失败，请重试！';
                }
            })
        }
    }
});