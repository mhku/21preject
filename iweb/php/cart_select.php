<?php
/**
*查询指定用户的购物车内容
*请求参数：
  uid-用户ID，必需
*输出结果：
  {
    "uid": 1,
    "data":[
      {"ctid":"1","courseId":1,"title":"xxx","pic":"xxx","price":1599.00},
      {"ctid":"2","courseId":3,"title":"xxx","pic":"xxx","price":1599.00},
      ...
      {"ctid":"5","courseId":6,"title":"xxx","pic":"xxx","price":1599.00}
    ]
  }
*/
@$uid = $_REQUEST['uid'] or die('uid required');

require('init.php');
$output['uid'] = $uid;

$sql = "SELECT cart.ctid,cart.courseid,cart.count,course.title,course.pic,course.price FROM course,cart WHERE cart.courseId=course.cid AND cart.userid=$uid";;
$result = mysqli_query($conn,$sql);
$output['data'] = mysqli_fetch_all($result, MYSQLI_ASSOC);

echo json_encode($output);





