<?php
/**
*请求参数：
  pageNum-需显示的页号；默认为1
*输出结果：
  {
    totalRecord: 58,  //总条数
    pageSize: 10,     //每页显示的条数
    pageCount: 6,     //总页数
    pageNum: 1,       //请求的页码
    data: [{},{} ... {}]  //数据
  }
*/

require('init.php');

@$pageNum = $_REQUEST['pageNum'] or $pageNum = 1;
@$areaId = $_REQUEST['areaId'] or $areaId = 0;
@$subAreaId = $_REQUEST['subAreaId'] or $subAreaId = 0;

$output['pageNum'] = intval($pageNum);
$output['pageSize'] = 3;

//拼接查询变量
$con="";
if($areaId!==0){
  $con.=" AND agent.areaId=$areaId";
}
if($subAreaId!==0){
  $con.=" AND agent.subAreaId=$subAreaId";
}

//获取总记录数和总页数
$sql = "SELECT COUNT(*) FROM agent WHERE 1=1 $con";
$result = mysqli_query($conn,$sql);
$output['totalRecord'] = intval( mysqli_fetch_row($result)[0] );
$output['pageCount'] = ceil($output['totalRecord']/$output['pageSize']);

//获取指定页中的数据
$start = ($output['pageNum']-1)*$output['pageSize'];
$count = $output['pageSize'];
$sql = "SELECT agentId,agentName,agentPhone,agentPic,areaName,subAreaName FROM agent,area,subArea WHERE agent.areaId=area.areaId AND agent.subAreaId=subArea.subAreaId $con LIMIT $start,$count";
$result = mysqli_query($conn,$sql);
$output['data'] = mysqli_fetch_all($result, MYSQLI_ASSOC);


echo json_encode($output);

