<?php
/**
*查询指定用户的收藏夹内容
*请求参数：
  uid-用户ID，必需
*输出结果：
  {
    "uid": 1,
    "data":[
      {"pid":1,"title1":"xxx","pic":"xxx","price":1599.00},
      {"pid":3,"title1":"xxx","pic":"xxx","price":1599.00},
      ...
      {"pid":5,"title1":"xxx","pic":"xxx","price":1599.00}
    ]
  }
*/
@$uid = $_REQUEST['uid'] or die('uid required');


require('init.php');
$output['uid'] = $uid;

$sql = "SELECT mf_favorite.uid,mf_favorite.pid,mf_product.title1,mf_product.title2,mf_product.pic,mf_product.price,mf_product.type FROM mf_product,mf_favorite WHERE mf_favorite.pId=mf_product.pid AND mf_favorite.uid=$uid";
$result = mysqli_query($conn,$sql);
$output['data'] = mysqli_fetch_all($result, MYSQLI_ASSOC);


echo json_encode($output);