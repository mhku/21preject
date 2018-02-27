<?php
/**
*注册新用户
*请求参数：
  phone-电话号码
  upwd-密码
  nickname-昵称
*输出结果：
* {"code":1,"userId":3,"phone":"","nickname":""}
* 或
* {"code":500}
*/
@$phone = $_REQUEST['phone'] or die('phone required');
@$upwd = $_REQUEST['upwd'] or die('upwd required');
@$nickname = $_REQUEST['nickname'] or $nickname ="";

require('init.php');

$sql = "INSERT INTO user (userId,phone,upwd,nickname) VALUES(NULL,'$phone','$upwd','$nickname')";
$result = mysqli_query($conn,$sql);

if($result){
  $output['code'] = 1;
  $output['userId'] = intval(mysqli_insert_id($conn));
  $output['phone']=$phone;
  $output['nickname']=$nickname;
}else {
  $output['code'] = 500;
}

echo json_encode($output);
