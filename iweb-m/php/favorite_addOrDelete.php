<?php
/**
*添加收藏记录
*请求参数：
  uid-用户ID，必需
  cid-课程ID，必需
*输出结果：
* {"code":1,"msg":"succ"}
* 或
* {"code":2}//已存在
*/
@$uid = $_REQUEST['uid'] or die('uid required');
@$cid = $_REQUEST['cid'] or die('cid required');

require('init.php');

//查看该课程是否已被收藏，无则创建，返回code=1；有则删除，返回code=2
$sql = "SELECT fid FROM favorite WHERE userId=$uid AND courseId=$cid";
$result = mysqli_query($conn,$sql);
$row = mysqli_fetch_row($result);
if($row){ //存在
  $fid = $row[0];
  $sql = "DELETE FROM favorite WHERE fid=$fid";
  mysqli_query($conn,$sql);
  $output['code'] = 2;
}else {   //不存在
  $fTime = time()*1000;
  $sql = "INSERT INTO favorite VALUES (NULL,$uid,$cid,$fTime)";
  mysqli_query($conn,$sql);
  $output['code'] = 1;
}

echo json_encode($output);






