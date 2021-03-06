<?php
/**
*向购物车中添加商品
*请求参数：
  uid-用户ID，必需
  pid-产品ID，必需
*输出结果：
* {"code":1,"msg":"succ"}
* 或
* {"code":2,,"msg":"succ"}//已存在
*/
@$uid = $_REQUEST['uid'] or die('uid required');
@$pid = $_REQUEST['pid'] or die('pid required');

require('init.php');

//判断购物车表中是否已经存在该商品记录
$sql = "SELECT ctid FROM mf_cart WHERE uid=$uid AND pid=$pid";
$result = mysqli_query($conn,$sql);
$row = mysqli_fetch_assoc($result);
if($row){   //之前曾经购买过该商品，则更新购买数量加1
  $sql = "update mf_cart set pCount=pCount+1 where uid=$uid AND pid=$pid";
  mysqli_query($conn,$sql);
  $output['code'] = 2;
  $output['msg'] = 'succ';
}else {     //之前从未购买过该商品，则添加购买记录，购买数量为1
  $sql = "INSERT INTO mf_cart VALUES(NULL,$uid, $pid,1)";
  mysqli_query($conn,$sql);
  $output['code'] = 1;
  $output['msg'] = 'succ';
}

echo json_encode($output);