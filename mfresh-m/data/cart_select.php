<?php
/**
*查询指定用户的购物车内容
*请求参数：
  uid-用户ID，必需
*输出结果：
  {
    "uid": 1,
    "data":[
      {"ctid":1,"pid":1,"title1":"xxx","pic":"xxx","price":1599.00,'pCount':1},
      {"ctid":2,"pid":2,"title1":"xxx","pic":"xxx","price":1599.00,'pCount':1},
      ...
      {"ctid":13,"pid":3,"title1":"xxx","pic":"xxx","price":1599.00,'pCount':1},
    ]
  }
*/
@$uid = $_REQUEST['uid'] or die('uid required');

require('init.php');
$output['uid'] = $uid;

$sql = "SELECT mf_cart.ctid,mf_cart.pid,mf_cart.pCount,mf_product.title1,mf_product.title2,mf_product.pic,mf_product.price,mf_product.type FROM mf_product,mf_cart WHERE mf_cart.pId=mf_product.pid AND mf_cart.uid=$uid";
$result = mysqli_query($conn,$sql);
$output['data'] = mysqli_fetch_all($result, MYSQLI_ASSOC);


echo json_encode($output);