$(function(){
    main(function(){
        navText("楼讯");
    });

    var pageNum=1;//当前页码
    newsList();

    function newsList(){
        $.ajax({
            type:"post",
            url:"php/news_list.php",
            data:{pageNum:pageNum},
            success:function(d){
                //console.log(d);
                //动态添加新闻列表
                var data= d.data;
                var htmlText="";
                for(var i=0;i<data.length;i++){
                    var t=dateFormat(parseInt(data[i].pubTime),'-');
                    htmlText+=`<li class="clearfloat">
                                <div class="news_info">
                                <h3><a href="news_details.html?newsId=${data[i].newsId}">${data[i].title}</a></h3>
                                <p>${data[i].abstract}</p>
                                <span>发布时间：${t}</span>
                                </div>
                                <a href="news_details.html?newsId=${data[i].newsId}" class="news_img"><img src="${data[i].pic}" alt=""/></a>
                                </li>`;
                }
                $(".news_list>ul").append(htmlText);

                if(d.pageCount==d.pageNum){
                    $(".loading").html('<span>没有了~</span>');
                }else{
                    $(".loading").html('<span class="more">加载更多</span>');
                }
            }
        });
    }

    /*加载更多*/
    $('.loading').on('click','.more',function(){
        $(".loading").html('<span class="icon"></span>');
        pageNum++;
        newsList();
    });
});


