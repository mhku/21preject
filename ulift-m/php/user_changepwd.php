<?php

@$userId = $_REQUEST['userId'] or die('userId required');
@$upwd = $_REQUEST['upwd'] or die('upwd required');

require('init.php');

$sql = "UPDATE user SET upwd='$upwd' WHERE userId='$userId'";
$result = mysqli_query($conn,$sql);

if($result){
  $output['code'] = 1;
}else {
  $output['code'] = 500;
}

echo json_encode($output);
