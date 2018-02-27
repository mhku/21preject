<?php
/*
  查询老师表中所有记录
*/
require('init.php');


$sql = "SELECT * FROM teacher";
$result = mysqli_query($conn,$sql);
$output= mysqli_fetch_all($result, MYSQLI_ASSOC);

echo json_encode($output);

