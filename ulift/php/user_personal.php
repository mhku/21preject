<?php

@$userId = $_REQUEST['userId'] or die('userId required');
@$nickname = $_REQUEST['nickname'] or $nickname ="";
@$sex = $_REQUEST['sex'] or $sex ="";
@$age = $_REQUEST['age'] or $age ="";
@$edu = $_REQUEST['edu'] or $edu ="";
@$job = $_REQUEST['job'] or $job ="";

require('init.php');

$sql = "UPDATE user SET nickname='$nickname',sex='$sex',age='$age',edu='$edu',job='$job' WHERE userId='$userId'";
$result = mysqli_query($conn,$sql);

if($result){
  $output['code'] = 1;
  $output['nickname']=$nickname;
}else {
  $output['code'] = 500;
}

echo json_encode($output);
