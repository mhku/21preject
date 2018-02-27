$(function() {
    main(function(){
        navText("租房");
    });

    //获取zfId
    var str=window.location.href;
    var zfId=str.substr(str.lastIndexOf("=")+1);
    var userId=sessionStorage.userId;
    //生成内容
    $.ajax({
        type:"post",
        url:"php/zf_details.php",
        data:{zfId:zfId},
        success:function(d){
            console.log(d);
            $(".zf_details_head h2").html(d.title);
            var t=parseInt(d.pubTime);
            $(".zf_details_head p").html('<span>房源编号：'+d.zfId+'</span><span> 更新时间：'+dateFormat(t,'-')+'</span>');
            $('.details_info>h3>span').text(d.price);
            var liStr=`<li class="left"><span>房型：</span>${d.houseType}</li>
                        <li class="left"><span>租赁方式：</span>${d.leaseWay}</li>
                        <li class="left"><span>面积：</span>${d.size}㎡</li>
                        <li class="left"><span>支付方式：</span>${d.pay}</li>
                        <li class="left"><span>楼层：</span>${d.floor}层</li>
                        <li class="left"><span>房屋朝向：</span>${d.orientation}</li>
                        <li><span>装修：</span>${d.decoration}</li>
                        <li><span>小区：</span>${d.community}</li>
                        <li><span>位置：</span>${d.address}</li>`;
            $('.details_info>ul').html(liStr);
            $('.details_content').html(d.details);
            /*生成图片*/
            if(d.picList.length!=0){
                var imgStr='';
                for(var i=0;i<d.picList.length;i++){
                    imgStr+=`<li><img src="${d.picList[i].zfPic}" alt=""/></li>`;
                }
                $('.img_scroll ul').width(d.picList.length*100);
                $('.img_scroll ul').html(imgStr);
                $('.img_scroll ul li:first').addClass('current');
                $('#largeImg').attr('src',d.picList[0].zfPic);
                //切换显示图片
                $('.img_scroll ul li').click(function(){
                    $('.img_scroll ul li').removeClass();
                    $(this).addClass('current');
                    var srcStr=$(this).find('img').attr('src');
                    $('#largeImg').attr('src',srcStr);
                });
                imgScroll();
            }
        }
    });

    //是否收藏
    if(userId){
        $.ajax({
            type:"post",
            url:"php/favorite_select.php",
            data:{userId:userId,zfId:zfId},
            success:function(d){
                //console.log(d);
                if(d.code==1){
                    $('.favorite span').text('取消收藏');
                }
            }
        });
    }
    //收藏
    $('.favorite').click(function(e){
        e.preventDefault();
        if(userId){
            $.ajax({
                type:"post",
                url:"php/favorite_addOrDelete.php",
                data:{userId:userId,zfId:zfId},
                success:function(d){
                    //console.log(d);
                    if(d.code==1){
                        $('.favorite span').text('取消收藏');
                    }else{
                        $('.favorite span').text('加入收藏');
                    }
                }
            });
        }else{
            alert('请登录后收藏喜欢的课程！');
        }
    });

});

//图片滚动
function imgScroll(){
    var sise=400;//当前可显示的宽度
    var moveSize=100;//每次移动宽度
    var ulW=$('.img_scroll ul').width()-400;//ul总宽度-显示宽度=可移动的宽度
    var ulL=parseInt($('.img_scroll ul').css('left'));//ul的left值
    $('.img_scroll_main .left').click(function(){
        if(ulL<0){
            ulL+=moveSize;
            $('.img_scroll ul').css('left',ulL);
        }
    });
    $('.img_scroll_main .right').click(function(){
        if(ulW>-ulL){
            ulL-=moveSize;
            $('.img_scroll ul').css('left',ulL);
        }
    });
}






