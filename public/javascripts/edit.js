/**
 * Created by Melody.Deng on 2016/12/1.
 */
var app = new Vue({
    el:"#container",
    data:{
        category:[],//分类
        //模态框
        promptTitle:'',
        promptBody:'',
        //文章
        title:'',
        categorySelected:'',
        abstract:'',
        editorValue:'',//编辑器标识
        postId:'',//保存当前文章的id
        newCategory:{
            categoryName:'',//新增分类名称
            parentId:'0',
            isManage:'',
            categoryId:''
        },
        isError:{
            add_root_error:'none',
        },
    },
    mounted:function () {
        var $this = this;
        $this.postId = $this.getUrlParam('id');
        $.ajax({
            url:'/post/edit/getInfo',
            type:'get',
            data:{
                id:$this.postId
            },
            success:function (data) {
                $this.categorySelected = data.post.categoryId;
                $this.title = data.post.title;
                $this.abstract = data.post.abstract;
                $this.postId = data.post._id;
            }
        });
        $this.getCategory();
    },
    methods:{
        //发表
        submit:function () {
            var $this = this;
            var title = $this.title;
            var content = $("#content").val();
            var mk_content = $("#mk-content").val();//markdown编辑器的源码
            var editor_value = $this.editorValue;//编辑器标识
            var categoryId = $this.categorySelected;//技术分类id
            var categoryName = $('#select-category option:selected').text();


            if(!title){
                $("#prompt").modal('show');
                $this.promptTitle ='错误提示';
                $this.promptBody = '标题不能为空';
            } else if(!content | content == '<p><br></p>'){
                $("#prompt").modal('show');
                $this.promptTitle ='错误提示';
                $this.promptBody = '内容不能为空';
            }else{
                $.ajax({
                    url:'/post/edit',
                    type:'post',
                    data:{
                        postId:$this.postId,
                        title:title,
                        content:content,
                        editor_value:editor_value,
                        mk_content:mk_content,
                        categoryId:categoryId,
                        categoryName:categoryName,
                    },
                    success:function (data) {
                        $("#prompt").modal('show');
                        $this.promptTitle ='提示';
                        $this.promptBody = '发表成功，正在跳转...';
                        setTimeout(function () {
                            var random = Math.random();
                            window.location.href = url + '/article?id=' + data.id + '&' + random;
                        },2000);
                    },
                    error:function () {
                        $("#prompt").modal('show');
                        $this.promptTitle ='错误提示';
                        $this.promptBody = '保存失败，请重试...';
                    }
                })
            }
        },
        mSubmit:function () {
            var $this = this;
            var title = $this.title;
            var content = $("#content").val();
            var mk_content = $("#mk-content").val();//markdown编辑器的源码
            var editor_value = $this.editorValue;//编辑器标识
            var categoryId = $this.categorySelected;//技术分类id
            var categoryName = $('#select-category option:selected').text();

            if(!title){
                $("#prompt").modal('show');
                $this.promptTitle ='错误提示';
                $this.promptBody = '标题不能为空';
            } else if(!content | content == '<p><br></p>'){
                $("#prompt").modal('show');
                $this.promptTitle ='错误提示';
                $this.promptBody = '内容不能为空';
            }else{
                $.ajax({
                    url:'/post',
                    type:'POST',
                    data:{
                        title:title,
                        content:content,
                        editor_value:editor_value,
                        mk_content:mk_content,
                        categoryId:categoryId,
                        categoryName:categoryName
                    },
                    success:function (data) {
                        $("#prompt").modal('show');
                        $this.promptTitle ='提示';
                        $this.promptBody = '发表成功，正在跳转...';
                        setTimeout(function () {
                            window.location.href = url + '/article?id=' + data.id;
                        },1000);
                    },
                    error:function () {
                        $("#prompt").modal('show');
                        $this.promptTitle ='错误提示';
                        $this.promptBody = '保存失败，请重试...';
                    }
                })
            }
        },
        //解析url参数
        getUrlParam:function (name) {
            var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"); //构造一个含有目标参数的正则表达式对象
            var r = window.location.search.substr(1).match(reg);  //匹配目标参数
            if (r != null) {
                return unescape(r[2]);
            }
            return null; //返回参数值
        },
        //添加根节点
        addRoot:function () {
            var $this = this;
            var categoryName = $this.newCategory.categoryName;
            if(!categoryName){
                $this.isError.add_root_error = 'block';
            }else{
                $.ajax({
                    url:'/category/save',
                    type:'post',
                    data:{
                        name:categoryName,
                        parent_id:"0",
                        is_manage:$this.newCategory.isManage
                    },
                    success:function () {
                        $("#add-category").modal('hide');
                        $("#prompt").modal('show');
                        $this.promptTitle = '提示';
                        $this.promptBody = '添加成功！';
                        $this.getCategory();
                        $this.newCategory.categoryName = '';
                    },
                    error:function () {
                        $("#prompt").modal('show');
                        $this.promptTitle = '错误提示';
                        $this.promptBody = '添加失败，请重试！';
                    }
                })
            }
        },
        //获取分类
        getCategory:function () {
            var $this = this;
            $.ajax({
                url:'/post/getCategory',
                type:'get',
                success:function (data) {
                    $this.newCategory.isManage = data.user.is_manage;//添加--分类权限
                    $this.category = data.category;
                    if(data.category.length !== 0){
                        $this.categorySelected = data.category[0]._id;
                    }
                }
            });
        }
    }
});
