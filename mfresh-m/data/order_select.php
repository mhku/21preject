<?php
/**
*查询指定用户的购物车内容
*请求参数：
  uid-用户ID，必需
*输出结果：
  {
    "uid": 1,
    "data":[
      {"cid":1,"title":"xxx","pic":"xxx","price":1599.00,'courseCount':1},
      {"cid":3,"title":"xxx","pic":"xxx","price":1599.00,'courseCount':3},
      ...
      {"cid":5,"title":"xxx","pic":"xxx","price":1599.00,'courseCount':5}
    ]
  }
*/
@$uid = $_REQUEST['uid'] or die('uid required');


require('init.php');
$output['uid'] = $uid;

$sql = "SELECT mf_orders.oid,mf_orders.totalprice,mf_orders_detail.pid,mf_orders.createtime,mf_orders.address,mf_orders.state,mf_orders_detail.count,mf_orders_detail.price,mf_product.title1,mf_product.title2,mf_product.pic,mf_product.type FROM mf_orders_detail,mf_orders,mf_product WHERE mf_orders_detail.pId=mf_product.pid AND mf_orders_detail.oid=mf_orders.oid and mf_orders.uid=$uid";
$result = mysqli_query($conn,$sql);
$output['data'] = mysqli_fetch_all($result, MYSQLI_ASSOC);


echo json_encode($output);