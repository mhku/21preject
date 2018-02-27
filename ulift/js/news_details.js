$(function() {
    main(function(){
        navText("楼讯");
    });

    //获取nid
    var str=window.location.href;
    var newsId=str.substr(str.lastIndexOf("=")+1);
    $.ajax({
        type:"post",
        url:"php/news_details.php",
        data:{newsId:newsId},
        success:function(d){
            //console.log(d);
            $(".news_details>h2").html(d.title);
            var t=parseInt(d.pubTime);
            $(".news_details>p").append(dateFormat(t,'-'));
            $(".details").html(d.content);
        }
    });

});