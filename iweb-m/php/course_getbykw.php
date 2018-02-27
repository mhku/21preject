<?php
/**
*根据查询关键字返回课程列表信息
*请求参数：
  kw-查询关键字，必需
*输出结果：
  [{
    "cid": 1,
    "title1":"xxx",
    ...
  }
  ]
*/
require('init.php');

@$kw = $_REQUEST['kw'];
if(empty($kw))
{
    echo '[]';
    return;
}

$output = [];

$sql = "SELECT * FROM course WHERE title LIKE '%$kw%' OR details LIKE '%$kw%'";
$result = mysqli_query($conn,$sql);

while(true)
{
    $row = mysqli_fetch_assoc($result);
    if(!$row)
    {
        break;
    }
    $output[] = $row;
}

echo json_encode($output);
?>