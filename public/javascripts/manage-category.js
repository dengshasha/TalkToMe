/**
 * Created by Melody.Deng on 2017/1/16.
 */
var app = new Vue({
    el:'#category',
    data:{
        category:[],//分类
        user:'',//用户信息
        promptTitle:'',//提示框标题
        promptBody:'',//提示框内容
        isError:{
            add_root_error:'none',
            category_error:'none'
        },
        newCategory:{
            categoryName:'',//新增分类名称
            parentId:'0',
            isManage:'',
            categoryId:''
        },
        category1:'',//分类原始数据
        editCategory:{
            categoryName:'',//编辑分类
            parentId:''
        },
        total:0,//父分类下的子分类和文章总数
        //弹出框
        removePrompt:'',
        btnIsShow:'',
        btnContent:'',
        userId:'',//访问的用户id
        allowAction:''//用户操作权限
    },
    mounted:function () {
        var $this = this;
        $this.getCategory();
    },
    methods:{
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
        //添加分类
        addCategory:function () {
            var $this = this;
            var categoryName = $this.newCategory.categoryName;
            if(!categoryName){
                $this.isError.category_error = 'block';
            }else{
                $.ajax({
                    url:'/category/save',
                    type:'post',
                    data:{
                        name:categoryName,
                        parent_id:$this.newCategory.parentId,
                        is_manage:$this.newCategory.isManage
                    },
                    success:function () {
                        $("#add-category").modal('hide');
                        $("#prompt").modal('show');
                        $this.promptTitle = '提示';
                        $this.promptBody = '添加成功';
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
        //删除分类
        removeCategory:function () {
            var $this = this;
            $.ajax({
                url:'/category/remove',
                type:'post',
                data:{
                    categoryId:$this.newCategory.parentId
                },
                success:function () {
                    $("#confirm").modal('hide');
                    $("#prompt").modal('show');
                    $this.promptTitle = '提示';
                    $this.promptBody = '删除成功';
                    $this.getCategory();
                },
                error:function () {
                    $("#prompt").modal('show');
                    $this.promptTitle = '错误提示';
                    $this.promptBody = '删除失败，请重试！';
                }
            })
        },
        //修改分类
        edit:function () {
            var $this = this;
            var categoryName = $this.editCategory.categoryName;
            if(!categoryName){
                $this.isError.category_error = 'block';
            }else{
                $.ajax({
                    url:'/category/edit',
                    type:'post',
                    data:{
                        name:categoryName,
                        parent_id:$this.editCategory.parentId,
                        is_manage:$this.newCategory.isManage,
                        _id:$this.newCategory.parentId
                    },
                    success:function () {
                        $("#edit-category").modal('hide');
                        $("#prompt").modal('show');
                        $this.promptTitle = '提示';
                        $this.promptBody = '修改成功';
                        $this.getCategory();
                    },
                    error:function () {
                        $("#prompt").modal('show');
                        $this.promptTitle = '错误提示';
                        $this.promptBody = '修改失败，请重试！';
                    }
                })
            }
        },
        //取消
        cancel:function () {
            var $this = this;
            $this.getCategory();
        },
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
            $this.userId = $this.getUrlParam('userId');
            $.ajax({
                url:'/category/getCategory',
                type:'get',
                data:{userId:$this.userId},
                success:function (data) {
                    $this.category1 = data.category;//编辑--获取所有分类
                    $this.newCategory.isManage = data.user.is_manage;//添加--分类权限
                    $this.allowAction = data.allowAction;
                    //获取所有分类并转换格式
                    var result = [];
                    $this.addChildrenNav(result,data.category,0);
                    $this.category = result;
                    //
                    $("#tree").treeview({
                        data:$this.category,
                        showButton:$this.allowAction,
                        showText:!data.allowAction,
                        levels: 10,
                        collapseIcon:'glyphicon glyphicon-folder-open',//列表未展开时的图标
                        expandIcon:'glyphicon glyphicon-folder-close',//列表展开时的图标
                        onNodeSelected: function(event, data) {
                            $this.newCategory.parentId = data._id;//新建子分类时获取该子分类的父类id，这个Id同时也是当前选中的分类id
                            $this.total = data.nodes.length;
                            if($this.total !== 0 ){
                                $this.removePrompt = '请将该分类下的子分类和文章移走，否则无法删除';
                                $this.btnIsShow = 'none';
                                $this.btnContent = '确定';
                            } else{
                                $this.removePrompt = '确定要删除该分类吗？';
                                $this.btnContent = '取消';
                                $this.btnIsShow = 'inline-block';
                            }
                            $this.editCategory.categoryName = data.name;//编辑--获取当前选中的分类名
                            //选择父类过滤掉当前分类
                            var currentCategory = $this.category1.findIndex((i) => i._id === $this.newCategory.parentId);
                            $this.category1.splice(currentCategory,1);
                            $this.editCategory.parentId = $this.category1[0]._id;
                        }
                    });
                }
            });
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