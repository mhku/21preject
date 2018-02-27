<?php
/**
*添加收藏记录
*请求参数：
  userId-用户ID，必需
  zfId-房源ID，必需
*输出结果：
* {"code":1,"msg":"succ"}
* 或
* {"code":2}//已存在
*/
@$userId = $_REQUEST['userId'] or die('userId required');
@$zfId = $_REQUEST['zfId'] or die('zfId required');

require('init.php');

//查看该课程是否已被收藏，无则创建，返回code=1；有则删除，返回code=2
$sql = "SELECT fid FROM favorite WHERE userId='$userId' AND zfId='$zfId'";
$result = mysqli_query($conn,$sql);
$row = mysqli_fetch_row($result);
if($row){ //存在
  $fid = $row[0];
  $sql = "DELETE FROM favorite WHERE fid=$fid";
  mysqli_query($conn,$sql);
  $output['code'] = 2;
}else {   //不存在
  $fTime = time()*1000;
  $sql = "INSERT INTO favorite VALUES (NULL,$userId,$zfId,$fTime)";
  mysqli_query($conn,$sql);
  $output['code'] = 1;
}

echo json_encode($output);






