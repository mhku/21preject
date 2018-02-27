<?php
/**
*根据房源ID返回房源详情
*请求参数：
  zfId-房源ID，必需
*输出结果：
  {
    "zfId": 1,
    "title":"xxx",
    ...
  }
*/
@$zfId = $_REQUEST['zfId'] or die('zfId required');

require('init.php');

$sql = "SELECT * FROM zufang WHERE zfId=$zfId";
$result = mysqli_query($conn,$sql);
$row = mysqli_fetch_assoc($result);
if($row){
  $output = $row;
}
$sql = "SELECT * FROM zfImg WHERE zfId=$zfId";
$result = mysqli_query($conn,$sql);
$output['picList']=mysqli_fetch_all($result, MYSQLI_ASSOC);

echo json_encode($output);