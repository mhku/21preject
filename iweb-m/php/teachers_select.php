<?php
/*
  ��ѯ��ʦ�������м�¼
*/
require('init.php');


$sql = "SELECT * FROM teacher";
$result = mysqli_query($conn,$sql);
$output= mysqli_fetch_all($result, MYSQLI_ASSOC);

echo json_encode($output);

