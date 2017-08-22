/**
 * Created by Melody.Deng on 2016/12/29.
 */
var app = new Vue({
    el:"#all",
    data:{
        article:'',//文章
        user:'',//用户
        category:'',//分类
        promptTitle:'',
        promptBody:'',
        post:[],
        postId:''
    },
    mounted:function () {
        var $this = this;
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
                url:'/getCategory',
                type:'get',
                success:function (data) {
                    var result = [];
                    if(data.post!=null && data.post.length>0){
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
                                $("#contentContainer").load('article/article-detailed?id='+ data._id + '&username='+data.authorName);
                            }
                            $this.postId = data._id;
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
                    setTimeout(function () {
                        window.location.href = url;
                    },1000);

                },
                error:function () {
                    $("#remove").modal('hide');
                    $("#prompt").modal('show');
                    $this.promptTitle = '错误提示';
                    $this.promptBody = '删除失败，请重试！';
                }
            })
        }
    }
});

    //搜索
    $("#search-submit").click(function () {
        $("#search-wrap").toggleClass('search-open');
        $("#search-input").focus();
        var value = $("#search-input").val();
        if(value.length > 0){
            $("#search-input").val('');

            $.ajax({
                url:'/search',
                type:'get',
                data:{
                    keywords:value
                },
                success:function (data) {
                    var total = data.searchResult.length;
                    var totalDiv = $('<div class="total"><p>共搜索到 '+ total +' 条数据</p></div>');

                    $("#contentContainer").html('');
                    if(total == 0){
                        $("#contentContainer").append(totalDiv);
                        var deDiv = $('<div class="default"><h3>没有搜索到结果啊，换个关键词试试吧</h3>'+
                        '<img src="../images/search-bg.jpg" alt=""></div>');
                        $("#contentContainer").append(deDiv);
                    }
                    if(total !== 0) {
                        $("#contentContainer").html('');
                        $("#contentContainer").append(totalDiv);
                        data.searchResult.map(function (r) {
                            var div = $(
                                '<div class="article-detailed2 col-md-4 col-md-offset-1">' + '<div class="head">' +
                                '<div class="title"><h3>' + r.title + '</h3></div> ' +
                                '<div class="time"><p>'+ r.time +'</p></div>'+
                                '<div class="classification"><p>分类：<a href="#">'+ r.categoryName +'</a></p></div>'+
                                '</div>' +
                                '<div class="content">'+ r.content +'</div>'+
                                '</div>');
                            $("#contentContainer").append(div);
                        });
                    }
                }
            })
        }else{
            return false;
        }
    });
    //搜索按钮回车提交
    $("#search-input").keypress (function (event) {
        var e = event || window.event;
        var keyCode = e.keyCode || e.which;
        if(keyCode === 13) {
            e.preventDefault();
            $("#search-submit").click();
        }
    });
