/**
 * Created by Melody.Deng on 2017/1/23.
 */
var app = new Vue({
    el:"#manage",
    data:{
        promptTitle:'',
        promptBody:'',
        postId:'',//获取当前选中的文章id
        userId:userId,
        category:''

    },
    mounted:function () {
        var $this = this;
        var random = Math.random();
        var url = '/manage/manage-article?userId='+ $this.userId + '&' + random;
        $("#manage-info").load(url);

    },
    methods:{
        loadModule:function (event) {
            var $this = this;
            var random = Math.random();
            $("#manage-info").load( '/manage/' + $(event.target).attr("PagePath")+"?userId="+ $this.userId +'&' + random);
            $(event.target).addClass('active');
            $(event.target).siblings().removeClass('active');
        }
    }
});