<?php
/**
*按发布时间逆序返回房源列表
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
@$priceMin = $_REQUEST['priceMin'] or $priceMin = 0;
@$priceMax = $_REQUEST['priceMax'] or $priceMax = 20000;
@$sizeMin = $_REQUEST['sizeMin'] or $sizeMin = 0;
@$sizeMax = $_REQUEST['sizeMax'] or $sizeMax = 20000;
@$houseType = $_REQUEST['houseType'] or $houseType = 0;
@$leaseWay = $_REQUEST['leaseWay'] or $leaseWay = 0;

$output['pageNum'] = intval($pageNum);
$output['pageSize'] = 3;

//拼接查询变量
$con="";
if($areaId!==0){
  $con.=" AND areaId=$areaId";
}
if($subAreaId!==0){
  $con.=" AND subAreaId=$subAreaId";
}
$con.=" AND (price BETWEEN $priceMin AND $priceMax)";
$con.=" AND (size BETWEEN $sizeMin AND $sizeMax)";
if($houseType!==0){
  $con.=" AND houseType='$houseType'";
}
if($leaseWay!==0){
  $con.=" AND leaseWay='$leaseWay'";
}

//获取总记录数和总页数
$sql = "SELECT COUNT(*) FROM zufang WHERE 1=1 $con";
$result = mysqli_query($conn,$sql);
$output['totalRecord'] = intval( mysqli_fetch_row($result)[0] );
$output['pageCount'] = ceil($output['totalRecord']/$output['pageSize']);

//获取指定页中的数据
$start = ($output['pageNum']-1)*$output['pageSize'];
$count = $output['pageSize'];
$sql = "SELECT * FROM zufang WHERE 1=1 $con ORDER BY pubTime DESC LIMIT $start,$count";
$result = mysqli_query($conn,$sql);
$output['data'] = mysqli_fetch_all($result, MYSQLI_ASSOC);
foreach($output['data'] as $i=>$house){
  $output['data'][$i]['picList'] = null;
  $imgZfId=$output['data'][$i]['zfId'];
  $sql = "SELECT * FROM zfImg WHERE zfId=$imgZfId";
  $result = mysqli_query($conn,$sql);
  $output['data'][$i]['picList']=mysqli_fetch_all($result, MYSQLI_ASSOC);
}


echo json_encode($output);

