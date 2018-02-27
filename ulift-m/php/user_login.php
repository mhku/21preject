<?php
/**
*用户登录验证
*请求参数：
  phone-手机号
  upwd-密码
*输出结果：
* {"code":1,"uid":1,"phone":"13012345678","nickname":""}
* 或
* {"code":400}
*/
@$phone = $_REQUEST['phone'] or die('phone required');
@$upwd = $_REQUEST['upwd'] or die('upwd required');

require('init.php');

$sql = "SELECT userId,phone,nickname FROM user WHERE phone='$phone' AND upwd='$upwd'";
$result = mysqli_query($conn,$sql);
$row = mysqli_fetch_assoc($result);

if($row){
  $output['code'] = 1;
  $output['userId'] = intval($row['userId']);
  $output['phone'] = $row['phone'];
  $output['nickname'] = $row['nickname'];
}else {
  $output['code'] = 400;
}

echo json_encode($output);
