$(function(){
    main(function(){
        navText("经纪人");
    });

    var pageNum=1;//当前页码
    var pageCount=1;//总页数

    //获取agentId
    var str=window.location.href;
    var agentId=str.substr(str.lastIndexOf("=")+1);

    //获取经纪人信息
    $.ajax({
        type:"post",
        url:"php/jingjiren_details.php",
        data:{agentId:agentId},
        success:function(d){
            console.log(d);
            $(".dianpu_head h2").html('经纪人'+d.agentName+'的店铺');
            $('.dianpu_jingjiren img').attr('src',d.agentPic);
            $('.dianpu_jingjiren h3').text(d.agentName);
            $('.dianpu_jingjiren p').append('<span>'+d.areaName+'</span><span>'+d.subAreaName+'</span>');
            $('.dianpu_jingjiren strong').append(d.agentPhone);
        }
    });


    zfList();//显示列表

    //生成房源列表
    function zfList(){
        $.ajax({
            type:"post",
            url:"php/jingjiren_dianpu.php",
            data:{agentId:agentId,pageNum:pageNum},
            success:function(d){
                console.log(d);
                var data= d.data;
                var htmlStr="";
                //生成列表
                for(var i=0;i<data.length;i++){
                    htmlStr+=`<li>
                                <a href="zf_details.html?zfId=${data[i].zfId}"><img src="${data[i].picList[0].zfPic}" alt=""/></a>
                                <h2><a href="zf_details.html?zfId=${data[i].zfId}">${data[i].title}</a></h2>
                                <p><span>${data[i].houseType}</span><span>${data[i].leaseWay}</span><span>${data[i].size}㎡</span></p>
                                <p>${data[i].community}</p>
                                <span><strong>${data[i].price}</strong>元/月</span>
                                </li>`;
                }
                $(".fangyuan_list").html(htmlStr);
                $('.dianpu_head .zf').html('租房房源：'+d.totalRecord+'套');

                //页码
                var pageHtml='<a href="prev">上一页</a>';
                pageCount=d.pageCount;
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
        });
    }

    //页码点击事件
    $(".pages").on('click','a',function(e){
        e.preventDefault();//清除a标记的默认行为
        var index=$(this).index();
        //console.log(index);
        if(index==0){//当点击的是“上一页”的时候
            if(pageNum==1) return;
            pageNum--;
        }else if(index==pageCount+1){//当点击的是下一页”的时候
            if(pageNum==pageCount) return;
            pageNum++;
        }else{
            pageNum=index;
        }
        zfList();
    });
});