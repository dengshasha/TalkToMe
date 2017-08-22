/**
 * Created by Melody.Deng on 2017/2/9.
 */
var app = new Vue({
    el:"#mypermission",
    data:{
        promptTitle:'',
        promptBody:'',
        postId:'',
        posts:[],
        allowAction:'',
        manageAction:''
    },
    mounted:function () {
        var $this = this;
        $this.getArticle();
    },
    methods:{
        getRemovePostId:function (event) {
            var $this = this;
            $this.postId = $(event.target).attr('data-value');
        },
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
                    $this.promptBody = '删除成功';
                    $this.getArticle();
                },
                error:function () {
                    $("#remove").modal('hide');
                    $("#prompt").modal('show');
                    $this.promptTitle = '错误提示';
                    $this.promptBody = '删除失败，请重试！';
                }
            });
        },
        getArticle:function () {
            var $this = this;
            $this.userId = $this.getUrlParam('userId');
            $.ajax({
                url:"/manage/manage-article/get-article",
                type:'get',
                data:{userId:$this.userId},
                success:function (data) {
                    $this.posts = data.postInfo;
                    $this.allowAction = data.allowAction;
                    $this.manageAction = data.manageAction;
                },
                error:function () {

                }
            })
        },
        //解析url参数
        getUrlParam:function (name) {
            var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"); //构造一个含有目标参数的正则表达式对象
            var r = window.location.search.substr(1).match(reg);  //匹配目标参数
            if (r != null) {
                return unescape(r[2]);
            }
            return null; //返回参数值
        }
    }
});