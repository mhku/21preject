function main(callback){
    $(".header").load("header.html",function(){
        //判断用户是否登录
        isLogin();
        //调用回调函数
        if(callback){
            callback();
        }
    });
}
$(".footer").load("footer.html");

//判断用户是否登录
function isLogin() {
    if(sessionStorage.userId){//已登录
        logined();
    }else{//未登录
        noLogin();
    }
}

//已登录
function logined(){
    var uname=sessionStorage.nickname?sessionStorage.nickname:sessionStorage.phone;
    var userStr='<a href="user/user.html"><span class="icon_user"></span>'+uname+'</a> | <a href="" class="user_quit">退出</a>';
    $("#header_user").html(userStr);
    //退出登录
    $(".user_quit").click(function(e){
        e.preventDefault();
        sessionStorage.clear();
        noLogin();
    });
}

//未登录
function noLogin(){
    var userStr='<a href="" id="loginModal">登录</a> | <a href="register.html">注册</a>';
    $("#header_user").html(userStr);
    //为登录绑定事件
    $("#loginModal").click(function(e){
        e.preventDefault();
        if($(".login_bg").size()==0){//未加载
            $.ajax({
                type:'get',
                url:'login.html',
                success:function(data){
                    //console.log(d);
                    $('body').append(data);
                    //关闭登录框
                    $(".login_bg").click(function(e){
                        /*兼容性解决方案：
                         e = e || window.event; // 事件
                         var target = e.target || e.srcElement; // 获得事件源
                         还可以通过为$(".login_box)添加阻止事件冒泡来解决：
                         $(".login_box").click(function(e){
                         e.stopPropagation();
                         });
                         */
                        if(e.target==this){
                            $(this).hide();
                        }
                    });
                    $(".close").click(function(){
                        $(".login_bg").hide();
                    });
                    //登录
                    $("#login").click(function(){
                        login();
                    });
                }
            });
        }else{//已加载
            $(".login_bg").show();
        }
    });
}

//登录
function login (){
    var phone=$.trim($("#phone").val());
    var upwd=$.trim($("#upwd").val());
    if(phone&&upwd){//用户名密码不为空
        $.ajax({
            type:"post",
            url:"php/user_login.php",
            data:{phone:phone,upwd:upwd},
            success:function(d){
                //console.log(d);
                if(d.code==1){//登录成功
                    sessionStorage.userId= d.userId;
                    sessionStorage.phone= d.phone;
                    sessionStorage.nickname= d.nickname;
                    //location.reload();//刷新页面
                    logined();
                    $('.login_bg').hide();
                    $("#phone").val("");
                    $("#upwd").val("");
                }else{//登录失败
                    $("#login_tips").text("您的用户名或密码不正确");
                }
            }
        });
    }else{//用户名或密码为空
        $("#login_tips").text("用户名和密码不能为空");
    }
}

//导航高亮
function navText(text){
    //console.log(text);
    $("#nav>ul>li").each(function(){
        var thisText=$(this).children("a").text();
        if(thisText==text){
            //console.log(thisText);
            //$("nav li").removeClass("active");
            $(this).addClass("current");
        }
    });
}

//时间转换函数
function dateFormat(time,sign){
    var t=new Date(time);
    var tf=function(i){return i>9?i:'0'+i};
    var year= tf(t.getFullYear());
    var month= tf(t.getMonth()+1);
    var day= tf(t.getDate());
    return year+sign+month+sign+day;
}





