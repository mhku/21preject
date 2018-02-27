<?php

@$userId = $_REQUEST['userId'] or die('userId required');
@$upwd = $_REQUEST['upwd'] or die('upwd required');

require('init.php');

$sql = "SELECT * FROM user WHERE userId='$userId' AND upwd='$upwd'";
$result = mysqli_query($conn,$sql);
$row = mysqli_fetch_assoc($result);
if($row){
  $output['code'] = 1;
  $output['msg'] = 'exist';
}else {
  $output['code'] = 2;
  $output['msg'] = 'non-exist';
}

echo json_encode($output);
