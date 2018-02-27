$(function(){
    main(goto);

    var userId=sessionStorage.userId;
    var pageNum=1;//当前页码
    var pageCount=1;//总页数
    $('.user_main').load('user_index.html',function(){
        index();
    });

    //点击侧栏的时候
    $('.user_side ul li').click(function(){
        pageNum=1;//当前页码
        pageCount=1;//总页数
        $('.user_side ul li').removeClass();
        $(this).addClass('active');
        var src=$(this).attr('data-load');
        $('.user_main').load(src,function(){
            switch (src)
            {
                case 'user_index.html':
                    index();
                    break;
                case 'user_favorite.html':
                    favorite();
                    break;
                case 'user_personal.html':
                    personal();
                    break;
                case 'user_changepwd.html':
                    changepwd();
                    break;
                default :
                    break;
            }
        })
    });


    function goto(){
        if(sessionStorage.userId){
            $(".user_quit").click(function(e){
                e.preventDefault();
                sessionStorage.clear();
                location.href='../index.html';
            });
        }else{
            location.href='../index.html';
        }
    }
    //加载首页
    function index(){
        zfList();
        var uname=sessionStorage.nickname?sessionStorage.nickname:sessionStorage.phone;
        $('.user_info h2').html(uname+'，您好~欢迎来到会员中心！');
        $('.user_info p span').append(sessionStorage.phone);
    }
    //我的关注
    function favorite(){
        zfList();
    }
    //个人资料
    function personal(){
        if(sessionStorage.nickname){
            $('#nickname').val(sessionStorage.nickname);
        }
        $('#submitPersonal').click(function(){
            var json={};
            $("#nickname,#age,#edu,#job").each(function(){
                json[$(this).attr("id")]=$(this).val();
            });
            json['sex']=$(".userform input[name='sex']:checked").val();
            json['userId']=userId;
            $.ajax({
                type:"post",
                url:"../php/user_personal.php",
                data:json,
                success:function(d){
                    //console.log(d);
                    if(d.code==1){
                        sessionStorage.nickname= d.nickname;
                        alert("资料更新成功！");
                    }
                }
            });
        });


    }

    //修改密码
    function changepwd(){
        var oldPwd,newPwd1,newPwd2;
        $('#oldPwd').blur(oldPwdCheck);
        $('#newPwd1').blur(newPwd1Check);
        $('#newPwd2').blur(newPwd2Check);
        $('#submitPwd').click(function(){
            var roldPwdCheck=oldPwdCheck();
            var rnewPwd1Check=newPwd1Check();
            var rnewPwd2Check=newPwd2Check();
            if(roldPwdCheck&&rnewPwd1Check&&rnewPwd2Check){
                newPwd1=$.trim($("#newPwd1").val());
                $.ajax({
                    type:"post",
                    url:"../php/user_changepwd.php",
                    data:{userId:userId,upwd:newPwd1},
                    success:function(d){
                        //console.log(d)
                        if(d.code==1){
                            $('#oldPwd,#newPwd1,#newPwd2').val('');
                            alert("修改密码成功!");
                        }
                    }
                });
            }
        });
    }




    //生成列表函数
    function zfList(){
        $.ajax({
            type:"post",
            url:"../php/favorite_zf.php",
            data:{userId:userId,pageNum:pageNum},
            success:function(d){
                //console.log(d);
                var data= d.data;
                var htmlStr="";
                //生成列表
                for(var i=0;i<data.length;i++){
                    htmlStr+=`<li>
                                <a href="../zf_details.html?zfId=${data[i].zfId}"><img src="../${data[i].picList[0].zfPic}" alt=""/></a>
                                <h2><a href="../zf_details.html?zfId=${data[i].zfId}">${data[i].title}</a></h2>
                                <p><span>${data[i].houseType}</span><span>${data[i].leaseWay}</span><span>${data[i].size}㎡</span></p>
                                <p>${data[i].community}</p>
                                <span><strong>${data[i].price}</strong>元/月</span>
                                </li>`;
                }
                $(".favorite_list").html(htmlStr);
                $('.dianpu_head .zf').html('租房房源：'+d.totalRecord+'套');

                pageCount=d.pageCount;
                page();//生成页码
                pageClick();//页码点击事件
            }
        });

    }
    //生成页码函数
    function page(){
        var pageHtml='<a href="prev">上一页</a>';
        for(var i=1;i<pageCount+1;i++){
            pageHtml+='<a href="'+i+'">'+i+'</a>';
        }
        pageHtml+='<a href="next">下一页</a>';
        $(".pages").html(pageHtml);
        if(pageNum==1){
            $(".pages a:first").addClass("disabled");
        }
        if(pageNum==pageCount){
            $(".pages a:last").addClass("disabled");
        }
        $(".pages a").eq(pageNum).addClass("cur");
    }
    //点击页码函数
    function pageClick(){
        $(".pages").on('click','a',function(e){
            e.preventDefault();//清除a标记的默认行为
            var index=$(this).index();
            if(index==0){//当点击的是“上一页”的时候
                if(pageNum==1) return;
                pageNum--;
            }else if(index==pageCount+1){//当点击的是下一页”的时候
                if(pageNum==pageCount) return;
                pageNum++;
            }else{
                pageNum=index;
            }
            console.log(pageNum);
            zfList();
        });
    }

    //验证旧密码
    function oldPwdCheck(){
        oldPwd=$.trim($("#oldPwd").val());
        if(!oldPwd){
            $("#oldPwd").parents('li').find('i').show().text('请输入原密码');
            return false;
        }else{
            var back=false;
            $.ajax({
                type:"post",
                url:"../php/user_oldPwd_check.php",
                data:{upwd:oldPwd,userId:userId},
                async:false,
                success:function(d){
                    if(d.code==1){//旧密码正确
                        $("#oldPwd").parents('li').find('i').hide();
                        back=true;
                    }else{
                        $("#oldPwd").parents('li').find('i').show().text('原密码错误');
                        back=false;
                    }
                }
            });
            return back;
        }
    }

    //验证密码
    function newPwd1Check(){
        newPwd1=$.trim($("#newPwd1").val());
        var newPwd1Size= newPwd1.length;
        if(!newPwd1Size){//密码为空时
            $("#newPwd1").parents('li').find('i').show().text("请输入您的密码");
            return false;
        }else if(newPwd1Size<6||newPwd1Size>12){
            $("#newPwd1").parents('li').find('i').show().text("密码长度应为6~12个字符之间");
            return false;
        }else{
            $("#newPwd1").parents('li').find('i').hide();
            return true;
        }
    }

    //验证重复密码
    function newPwd2Check(){
        newPwd2= $.trim($("#newPwd2").val());
        if(newPwd1Check()){
            if(newPwd1!=newPwd2){
                $("#newPwd2").parents('li').find('i').show().text("两次密码不一致");
                return false;
            }else{
                $("#newPwd2").parents('li').find('i').hide();
                return true;
            }
        }
    }

});




