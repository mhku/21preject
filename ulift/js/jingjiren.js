$(function(){
    main(function(){
        navText("经纪人");
    });

    var pageNum=1;//当前页码
    var pageCount=1;//总页数
    var areaId=0;//一级区域
    var subAreaId=0;//二级区域

    agentList();//显示列表

    //显示列表
    function agentList(){
        var json={
            pageNum:pageNum,
            areaId:areaId,
            subAreaId:subAreaId
        };
        $.ajax({
            type:"post",
            url:"php/jingjiren_list.php",
            data:json,
            success:function(d){
                console.log(d);
                var data= d.data;
                var htmlStr="";
                //生成列表
                for(var i=0;i<data.length;i++){
                    htmlStr+=`<li class="clearfloat">
                            <a href="dianpu.html?agentId=${data[i].agentId}" class="a_img"><img src="${data[i].agentPic}" alt=""/></a>
                            <div class="information">
                                <h2><a href="dianpu.html?agentId=${data[i].agentId}">${data[i].agentName}</a></h2>
                                <p>主营板块：<span>${data[i].areaName}</span><span>${data[i].subAreaName}</span></p>
                                <strong><span></span>${data[i].agentPhone}</strong>
                            </div>
                            <a href="dianpu.html?agentId=${data[i].agentId}" class="a_button">进入TA的店铺</a>
                            </li>`;
                }
                $(".jingjiren_list>ul").html(htmlStr);
                $('.jingjiren_list_head strong').text(d.totalRecord);

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
        agentList();
    });

    //加载区域
    $.ajax({
        type:"post",
        url:"php/area_list.php",
        success:function(d){
            //console.log(d);
            var areaStr="";
            for(var i=0;i<d.length;i++){
                areaStr+='<a href="" data-areaId="'+d[i].areaId+'">'+d[i].areaName+'</a>';
            }
            $('#area').append(areaStr);
        }
    });

    //为一级区域绑定事件
    $('#area').on('click','a',function(e){
        e.preventDefault();
        $('#area a').removeClass();
        $(this).addClass('current');
        areaId=$(this).attr('data-areaId');
        subAreaId=0;
        pageNum=1;
        agentList();//更新列表
        if(areaId==0){
            $('#subArea').empty().hide();
        }else{
            $.ajax({
                type:"post",
                url:"php/area_list_sub.php",
                data:{areaId:areaId},
                success:function(d){
                    //console.log(d);
                    var subAreaStr='<a href="" class="current" data-subAreaId="0">不限</a>';
                    for(var i=0;i<d.length;i++){
                        subAreaStr+='<a href="" data-subAreaId="'+d[i].subAreaId+'">'+d[i].subAreaName+'</a>';
                    }
                    $('#subArea').empty().append(subAreaStr).show();
                }
            });
        }
    });
    //为二级区域绑定事件
    $('#subArea').on('click','a',function(e){
        e.preventDefault();
        $('#subArea a').removeClass();
        $(this).addClass('current');
        subAreaId=$(this).attr('data-subAreaId');
        pageNum=1;
        agentList();//更新列表
    });



});