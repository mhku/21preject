<?php
/**
*根据新闻ID返回新闻详情
*请求参数：
  newsId-新闻ID，必需
*输出结果：
  {
    "newsId": 1,
    ...
  }
*/
@$newsId = $_REQUEST['newsId'] or die('newsId required');

require('init.php');

$sql = "SELECT * FROM news WHERE newsId=$newsId";
$result = mysqli_query($conn,$sql);
$row = mysqli_fetch_assoc($result);
if($row){
  $output = $row;
}

echo json_encode($output);