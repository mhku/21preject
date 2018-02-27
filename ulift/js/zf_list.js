$(function(){
    main(function(){
        navText("租房");
    });

    var pageNum=1;//当前页码
    var pageCount=1;//总页数
    var areaId=0;//一级区域
    var subAreaId=0;//二级区域
    var priceMin=0;//最低租金
    var priceMax=20000;//最高租金
    var sizeMin=0;//最小面积
    var sizeMax=20000;//最大面积
    var houseType=0;//房型
    var leaseWay=0;//租赁方式

    zfList();//显示列表

    //显示列表
    function zfList(){
        var json={
            pageNum:pageNum,
            areaId:areaId,
            subAreaId:subAreaId,
            priceMin:priceMin,
            priceMax:priceMax,
            sizeMin:sizeMin,
            sizeMax:sizeMax,
            houseType:houseType,
            leaseWay:leaseWay
        };
        $.ajax({
            type:"post",
            url:"php/zf_list.php",
            data:json,
            success:function(d){
                console.log(d);
                var data= d.data;
                var htmlStr="";
                //生成列表
                for(var i=0;i<data.length;i++){
                    htmlStr+=`<li class="clearfloat">
                            <a href="zf_details.html?zfId=${data[i].zfId}" target="_blank"><img src="${data[i].picList[0].zfPic}" alt=""/></a>
                            <div class="information">
                                <h2><a href="zf_details.html?zfId=${data[i].zfId}" target="_blank">${data[i].title}</a></h2>
                                <p><span>${data[i].houseType}</span><span>${data[i].leaseWay}</span><span>${data[i].size}㎡</span><span>${data[i].floor}层</span><span>朝向：${data[i].orientation}</span></p>
                                <p>${data[i].community}</p>
                            </div>
                            <span><strong>${data[i].price}</strong>元/月</span>
                            </li>`;
                }
                $(".zf_list>ul").html(htmlStr);
                $('.zf_list_head strong').text(d.totalRecord);

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
        zfList();//更新列表
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
        zfList();//更新列表
    });

    //为租金绑定事件
    $("#price a").click(function(e){
        e.preventDefault();
        $("#price a").removeClass();
        $(this).addClass('current');
        priceMin=$(this).attr("data-min");
        priceMax=$(this).attr("data-max");
        pageNum=1;
        zfList();//更新列表
    });

    //为面积绑定事件
    $("#size a").click(function(e){
        e.preventDefault();
        $("#size a").removeClass();
        $(this).addClass('current');
        sizeMin=$(this).attr("data-min");
        sizeMax=$(this).attr("data-max");
        pageNum=1;
        zfList();//更新列表
    });

    //为房型绑定事件
    $("#houseType a").click(function(e){
        e.preventDefault();
        $("#houseType a").removeClass();
        $(this).addClass('current');
        houseType=$(this).attr("data-houseType");
        pageNum=1;
        zfList();//更新列表
    });

    //为租赁方式绑定事件
    $("#leaseWay a").click(function(e){
        e.preventDefault();
        $("#leaseWay a").removeClass();
        $(this).addClass('current');
        leaseWay=$(this).attr("data-leaseWay");
        pageNum=1;
        zfList();//更新列表
    });

});