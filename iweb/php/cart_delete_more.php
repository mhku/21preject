<?php
/**
*根据购物车详情记录编号删除该购买记录
*请求参数：
  ctid-详情记录编号数组
*输出结果：
* {"code":1,"msg":"succ"}
* 或
* {"code":400}
*/
@$ctids = $_REQUEST['ctids'] or die('ctids required');

require('init.php');

$d=implode(",",$ctids);

$sql = "DELETE FROM cart WHERE ctid in ($d)";
$result = mysqli_query($conn,$sql);
if($result){
  $output['code']=1;
  $output['msg']='succ';
}else {
  $output['code']=400;
}
echo json_encode($output);
