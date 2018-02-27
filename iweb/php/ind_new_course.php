<?php
/*
    查询课程表中最新四条记录
  */
require('init.php');
$count=4;//查询条数
$sql = "SELECT * FROM course,type,teacher WHERE course.typeId=type.tpid and course.teacherId=teacher.tid ORDER BY cid DESC LIMIT $count";
$result = mysqli_query($conn,$sql);
$output = mysqli_fetch_all($result, MYSQLI_ASSOC);


echo json_encode($output);