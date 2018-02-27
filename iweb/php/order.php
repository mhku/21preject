<?php

/*  生成订单
    请求参数：
        uid：用户id
    输出结果：
        {"code":1}

*/

@$uid = $_REQUEST['uid'] or die('uid required');

require('init.php');

//生成订单记录，并获取订单编号
$sql = "INSERT INTO orders VALUES(NULL, $uid)";
mysqli_query($conn,$sql);
$oid = mysqli_insert_id($conn);

//从购物车表中查询要添加到订单详情的商品记录
$sql = "SELECT * FROM cart WHERE userid=$uid";;
$result = mysqli_query($conn,$sql);
$row = mysqli_fetch_all($result, MYSQLI_ASSOC);

foreach($row as $d){
    $sql="INSERT INTO orders_detail VALUES (NULL,$oid,$d[courseId],$d[count])";
    mysqli_query($conn,$sql);
    $sql="DELETE FROM cart WHERE ctid=$d[ctid]";
    mysqli_query($conn,$sql);
    $output["code"]=1;
}

echo json_encode($output);



