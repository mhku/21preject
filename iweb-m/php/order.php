<?php

/*  生成订单
	请求方法： POST
    请求消息头部：
		Content-Type:  application/json
	响应消息主体数据形如：
		{
			"uid": 999,
			"price":1999,
			"data":[
						{"cid":10, "count":3,"price":100},
						{"cid":15, "count":1,"price":200}
					]
		}


    响应消息头部：
		Content-Type: application.json
	响应消息主体数据形如：
        {"code":1}

*/

$postData = $GLOBALS['HTTP_RAW_POST_DATA'];		//读取原始POST请求主体数据
$postData = json_decode($postData, true);		//将原始JSON数据解析为PHP数组

$uid = $postData['uid'];
$price = $postData['price'];
require('init.php');

//生成订单记录，并获取订单编号
$t = time() * 1000;
$sql = "INSERT INTO orders VALUES(NULL, $uid,$t,'北三环西路',$price,0)";
mysqli_query($conn,$sql);
$oid = mysqli_insert_id($conn);

foreach($postData['data'] as $d){
    $sql="INSERT INTO orders_detail VALUES (NULL,$oid,$d[cid],$d[count],$d[price])";
    mysqli_query($conn,$sql);
    $sql="DELETE FROM cart WHERE userid=$uid and courseid=$d[cid]";
    mysqli_query($conn,$sql);
    $output["code"]=1;
}

echo json_encode($output);



