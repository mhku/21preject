<?php
/*
*根据一级区域返回二级区域列表
*请求参数：
  areaId-一级逾期ID，必需
*输出结果：
  {
    "subAreaId": 1,
    ...
  }
*/
@$areaId = $_REQUEST['areaId'] or die('areaId required');
require('init.php');

$sql = "SELECT * FROM subArea WHERE areaId=$areaId";
$result = mysqli_query($conn,$sql);
$output= mysqli_fetch_all($result, MYSQLI_ASSOC);

echo json_encode($output);
