/**
 * Created by Melody.Deng on 2016/11/29.
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
        editorValue:'',
        isError:{
            add_root_error:'none'
        },
        newCategory:{
            categoryName:'',//新增分类名称
            parentId:'0',
            isManage:'',
            categoryId:''
        }
    },
    mounted:function () {
        var $this = this;
        $this.getCategory();
    },
    methods:{
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
        },
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
        }

    }
});

    /*$("#tags").change(function () {
        var value = this.value.trim(' ');
        var str = value.split(" ");
        $("#tag-content").html("");
        var tagList=[];
        for(var i = 0;i < str.length;i ++){
            if(str[i] != ""){
                tagList.push(str[i]);
                $("#tag-content").append("<span class='tag-content-a'>" + str[i] + "<a></a></span>");
            }
        }
        //删除标签
        var tags_a = $("#tag-content a");
        for(var i = 0;i < tags_a.length ;i++){
            tags_a[i].onclick = function () {
                var tags_a_text = $(this).parent().text();
                alert(tags_a_text);
                $(this).parent().remove();
                var tags_index = value.indexOf(tags_a_text);
                if(tags_index > -1){
                    value = value.replace(tags_a_text,"");
                }
                $("#tags").val(value);
            };
        }
    });*/


