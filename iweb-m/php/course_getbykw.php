<?php
/**
*���ݲ�ѯ�ؼ��ַ��ؿγ��б���Ϣ
*���������
  kw-��ѯ�ؼ��֣�����
*��������
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