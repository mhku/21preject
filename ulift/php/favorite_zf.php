<?php
/**
*按发布时间逆序返回房源列表
*请求参数：
  userId-用户id
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
@$userId = $_REQUEST['userId'] or die('userId required');

$output['pageNum'] = intval($pageNum);
$output['pageSize'] = 3;



//获取总记录数和总页数
$sql = "SELECT COUNT(*) FROM favorite WHERE userId='$userId'";
$result = mysqli_query($conn,$sql);
$output['totalRecord'] = intval( mysqli_fetch_row($result)[0] );
$output['pageCount'] = ceil($output['totalRecord']/$output['pageSize']);

//获取指定页中的数据
$start = ($output['pageNum']-1)*$output['pageSize'];
$count = $output['pageSize'];
$sql = "SELECT * FROM zufang,favorite WHERE favorite.userId='$userId' AND zufang.zfId=favorite.zfId ORDER BY fTime DESC LIMIT $start,$count";
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

