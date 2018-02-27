<?php
/**
*根据经纪人ID返回经纪人详情
*请求参数：
  agentId-经纪人ID，必需
*输出结果：
  {
    "agentId": 1,
    ...
  }
*/
@$agentId = $_REQUEST['agentId'] or die('agentId required');

require('init.php');

$sql = "SELECT agentId,agentName,agentPhone,agentPic,areaName,subAreaName FROM agent,area,subArea WHERE agentId=$agentId";
$result = mysqli_query($conn,$sql);
$row = mysqli_fetch_assoc($result);
if($row){
  $output = $row;
}

echo json_encode($output);