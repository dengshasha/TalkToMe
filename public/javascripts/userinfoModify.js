/**
 * Created by Melody.Deng on 2016/11/30.
 */
$(document).ready(function() {

    $("#upload").on("click",function () {
        $.ajaxFileUpload({
            fileElementId:'fileUpload',
            url: '/post/imgupload',
            dataType: 'text',
            beforeSend: function (XMLHttpRequest) {
                //("loading");  
            },
            success: function (data, textStatus) {

                $("#headportrait").attr("src",data);/*图片显示*/
                $("#fileUpload").attr("value",data);/*上传头像按钮*/
                $("#imageUrl").attr("value",data);
            },
            error: function (XMLHttpRequest, textStatus, errorThrown) {

                //       $.messager.showWin({ msg: textStatus, title: '错误提示', color: 'red' });  
            },
            complete: function (XMLHttpRequest, textStatus) {
                //("loaded");  
            }
        });

    });


    //表单提交
    $("#submit").click(function () {
        var nickname = $("#nickname").val();
        var radioList = document.getElementsByName('gender');
        var radioValue = "";
        for(var i = 0;i < radioList.length; i++){
            if(radioList[i].checked == true){
                radioValue = radioList[i].value;
            }
        }
        var duties = $('#duties').val();
        var imgSrc = $("#headportrait").attr("src");

        if(!nickname){
            $("#prompt").modal('show');

            $("#prompt-body").html ('标题不能为空');
            // userInfo_modal_body.html("✕ 昵称不能为空");
        }
        else if(nickname.length > 15){
            $("#prompt").modal('show');
            $("#prompt-body").html('✕ 昵称长度不能超过15个字符');
        }
        else{
            $.ajax({
                url:'/userinfoModify',
                type:'POST',
                data:{
                    nickname:nickname,
                    gender:radioValue,
                    signature:signature,
                    duties:duties,
                    avator:imgSrc
                },
                success:function (data) {
                    if(data.success == 0){
                        $("#prompt").modal('show');
                        $("#prompt-body").html('保存失败，请重试...');
                    }
                    if(data.success == 1){
                        $("#prompt").modal('show');
                        $("#prompt-body").html('保存成功，正在跳转...');
                        setTimeout(function () {
                            window.location.href = url + "/manage" + user._id;
                        },2000);
                    }
                }
            })
        }
    })
});