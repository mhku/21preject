$(function(){
    main();

    var uphone,upwd1,upwd2,nickname;

    $("#uphone").blur(phoneCheck);
    $("#upwd1").blur(pwd1Check);
    $("#upwd2").blur(pwd2Check);
    $("#ucheckbox").click(function(){
        $("#register").prop("disabled",!$(this).prop("checked")).toggleClass("disabled");
    });

    //提交注册
    $("#register").click(function(){
        var rphone=phoneCheck();
        var rpwd1=pwd1Check();
        var rpwd2=pwd2Check();
        if(rphone&&rpwd1&&rpwd2){
            nickname= $.trim($("#nickname").val());
            $.ajax({
                type:"post",
                url:"php/user_register.php",
                data:{phone:uphone,upwd:upwd1,nickname:nickname},
                success:function(d){
                    //console.log(d)
                    if(d.code==1){
                        sessionStorage.uid= d.uid;
                        sessionStorage.phone= d.phone;
                        sessionStorage.nickname= d.nickname;
                        alert("恭喜您，注册成功！即将为您跳转到刚才的页面。");
                        history.go(-1);
                    }
                }
            });
        }
    });


    //验证手机号
    function phoneCheck(){
        uphone= $.trim($("#uphone").val());
        var regPhone= /^1[3578]\d{9}$/;
        if(!uphone){
            $("#uphone").siblings("span").hide();
            $("#uphone").siblings("i").show().text("请填写您的手机号");
            return false;
        }else if(!regPhone.test(uphone)){
            $("#uphone").siblings("span").hide();
            $("#uphone").siblings("i").show().text("请输入正确的手机号码");
            return false;
        }else if(phoneExist(uphone)){
            $("#uphone").siblings("span").hide();
            $("#uphone").siblings("i").show().text("此手机号已被其他用户绑定");
            return false;
        }else{
            $("#uphone").siblings("span").show();
            $("#uphone").siblings("i").hide();
            return true;
        }
    }
    //验证手机号是否被绑定
    function phoneExist(uphone){
        var back=false;
        $.ajax({
            type:"post",
            url:"php/user_check_phone.php",
            data:{phone:uphone},
            async:false,
            success:function(d){
                if(d.code==1){//用户名已经存在
                    back=true;
                }else{
                    back=false;
                }
            }
        });
        return back;
    }
    //验证密码
    function pwd1Check(){
        upwd1=$.trim($("#upwd1").val());
        var upwd1Size= upwd1.length;
        if(!upwd1Size){//密码为空时
            $("#upwd1").siblings("span").hide();
            $("#upwd1").siblings("i").show().text("请输入您的密码");
            return false;
        }else if(upwd1Size<6||upwd1Size>12){
            $("#upwd1").siblings("span").hide();
            $("#upwd1").siblings("i").show().text("密码长度应为6~12个字符之间");
            return false;
        }else{
            $("#upwd1").siblings("span").show();
            $("#upwd1").siblings("i").hide();
            return true;
        }
    }
//验证重复密码
    function pwd2Check(){
        upwd2= $.trim($("#upwd2").val());
        if(pwd1Check()){
            if(upwd1!=upwd2){
                $("#upwd2").siblings("span").hide();
                $("#upwd2").siblings("i").show().text("两次输入的密码不一致");
                return false;
            }else{
                $("#upwd2").siblings("span").show();
                $("#upwd2").siblings("i").hide();
                return true;
            }
        }
    }



});



