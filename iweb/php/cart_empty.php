<?php
/**
*根据购物车编号删除所有记录
*请求参数：
  uid-用户编号
*输出结果：
* {"code":1,"msg":"succ"}
* 或
* {"code":400}
*/
@$uid = $_REQUEST['uid'] or die('uid required');

require('init.php');

$sql = "DELETE FROM cart WHERE userId=$uid";
$result = mysqli_query($conn,$sql);
if($result){
  $output['code']=1;
  $output['msg']='succ';
}else {
  $output['code']=400;
}


echo json_encode($output);