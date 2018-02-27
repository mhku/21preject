<?php

require('init.php');

$sql = "SELECT * FROM area";
$result = mysqli_query($conn,$sql);
$output= mysqli_fetch_all($result, MYSQLI_ASSOC);

echo json_encode($output);
