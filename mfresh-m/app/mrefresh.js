/**
 * Created by Administrator on 2016/11/28.
 */
angular.module('refreshApp',['ionic'])
    .config(function ($stateProvider,$urlRouterProvider,$ionicConfigProvider) {
        $ionicConfigProvider.tabs.position("bottom");

        $stateProvider
            .state('start', {
                url: '/start',
                templateUrl: 'tpl/start.html',
                controller:'startCtrl'
            })
            .state('index', {
                url: '/index',
                templateUrl: 'tpl/index.html',
                controller:'indexCtrl'
            })
            .state('user', {
                url:'/user',
                templateUrl: 'tpl/user.html',
                controller:'userCtrl'
            })
            .state('cart', {
                url:'/cart',
                templateUrl: 'tpl/cart.html',
                controller:'cartCtrl'
            })
            .state('login', {
                url:'/login',
                templateUrl: 'tpl/login.html',
                controller:'loginCtrl'
            })
            .state('list', {
                url:'/list/:typeNum',
                templateUrl: 'tpl/list.html',
                controller:'listCtrl'
            })
            .state('detail', {
                url:'/detail/:pid',
                templateUrl: 'tpl/detail.html',
                controller:'detailCtrl'
            })
            .state('search', {
                url:'/search',
                templateUrl: 'tpl/search.html',
                controller:'searchCtrl'
            });
        $urlRouterProvider.otherwise('start');
    })
    .controller('parentCtrl',
    ['$scope','$state','$ionicSideMenuDelegate','$ionicModal','$window','$rootScope','$http',
        function ($scope,$state,$ionicSideMenuDelegate,$ionicModal,$window,$rootScope,$http) {
            //跳转方法
            $scope.jump = function (arg) {
                $state.go(arg);
            }

            //页脚页签的选中状态,是否显示返回键
            $scope.footerTabIndex = 0;
            $scope.footerTabChanged = function(index){
                $scope.footerTabIndex = index;
                $scope.isHome = $scope.footerTabIndex == 0;
            }

            //返回功能
            $scope.backWard = function(){
                $window.history.back();
                console.log(111);
            };

            //更新购物车的数据
            $scope.updateCart = function(){
                if($rootScope.uid) {
                    $http.get('data/cart_select.php?uid=' + $rootScope.uid)
                        .success(function (result) {
                            console.log(result);
                            $scope.cartData = result.data;
                            $scope.cartCount = result.data.length;
                        });
                }
            };

            //弹出设置框
            $ionicModal.fromTemplateUrl('modal.html', {
                scope: $scope,
                animation: 'slide-in-right'
            }).then(function(modal) {
                $scope.modal = modal;
            });
            $scope.settings = function() {
                $scope.modal.show();
            };

            //判断当前用户是否登录
            $rootScope.isLogin = false;
        }
    ])
    .controller('startCtrl',['$scope','$timeout','$interval','$state',
        function($scope,$timeout,$interval,$state){
            $scope.secondNumber = 6;
            $timeout(function(){
                $state.go('index');
            },6000);
            $interval(function(){
                if($scope.secondNumber>0)
                    $scope.secondNumber--;
            },1000);
        }])
    .controller('indexCtrl',['$scope','$http','$timeout','$ionicSlideBoxDelegate',
        function($scope,$http,$timeout,$ionicSlideBoxDelegate){
            $scope.footerTabIndex = 0;
            $scope.isHome = true;
            //定义轮播的数据
            $scope.imgArray = ['images/banner_01.jpg','images/banner_02.jpg',
                'images/banner_03.jpg','images/banner_04.jpg'];
            $scope.pageClick = function(index) {
                console.log(index);
                $ionicSlideBoxDelegate.slide(index);
            }

            $scope.hasMore = true;
            $scope.pageNum = 1;
            //获取初始的新闻数据
            $http.get('data/news_select.php?pageNum='+$scope.pageNum)
                .success(function (newsData) {
                    $scope.newsList = newsData.data;
                    $scope.pageNum++;
                });
            //加载更多
            $scope.loadMore = function () {
                $timeout(function () {//并非马上加载，而是2s后再加载
                    $http.get('data/news_select.php?pageNum='+$scope.pageNum)
                        .success(function (newsData) {
                            if($scope.pageNum == newsData.pageCount)
                            {
                                $scope.hasMore = false;
                            }
                            $scope.newsList = $scope.newsList.concat(newsData.data);
                            $scope.pageNum++;
                            //本次下拉动作结束
                            $scope.$broadcast('scroll.infiniteScrollComplete');
                        })
                },2000);
            };
        }
    ])
    .controller('listCtrl',['$scope','$http','$stateParams','$timeout','$rootScope',
        function($scope,$http,$stateParams,$timeout,$rootScope){
            $scope.footerTabIndex = 1;
            //切换显示方式
            $rootScope.showList = true;

            $scope.hasMore = true;
            $scope.pageNum = 1;
            $http.get('data/product_select.php?pageNum=' + $scope.pageNum + '&type=' + $stateParams.typeNum)
                .success(function(result){
                    $scope.productData  = result.data;
                    $scope.pagerInfo = $scope.pageNum +'/' + result.pageCount;
                    if($scope.pageNum == result.pageCount)
                    {
                        $scope.hasMore = false;
                    }
                });

            //加载更多
            $scope.loadMore = function () {
                $timeout(function () {
                    $scope.pageNum++;
                    $http.get('data/product_select.php?pageNum='+$scope.pageNum + '&type=' + $stateParams.typeNum)
                        .success(function (listData) {
                            if($scope.pageNum == listData.pageCount)
                            {
                                $scope.hasMore = false;
                            }
                            $scope.pagerInfo = $scope.pageNum +'/' + listData.pageCount;

                            $scope.productData = $scope.productData.concat(listData.data);
                            $scope.changeDataArray();
                            $scope.pageNum++;
                            $scope.$broadcast('scroll.infiniteScrollComplete');
                        })
                },2000);
            };

            //切换显示形式
            $scope.changeShowType = function(){
                $rootScope.showList = !$rootScope.showList;
                $scope.changeDataArray();
            };

            //更换数据结构
            $scope.productArray = [];
            $scope.changeDataArray = function(){
                for(var i=0;i<=$scope.productData.length/2;i++){
                    $scope.productArray[i] = [];
                    for(var j=0;j<2;j++){
                        $scope.productArray[i][j] = $scope.productData[i*2+j];
                    }
                }
            };
        }])
    .controller('detailCtrl',['$scope','$http','$stateParams','$rootScope','$timeout',
        function($scope,$http,$stateParams,$rootScope,$timeout){
            $scope.footerTabIndex = 1;
            $http.get('data/product_detail.php?pid=' + $stateParams.pid)
                .success(function(result){
                    $scope.product  = result;
                });

            //加入购物车
            $scope.addCart = function(){
                if(!$rootScope.uid){
                    $scope.$parent.jump('login');
                }else{
                    $http.get('data/cart_add.php?uid=' +
                    $rootScope.uid + '&pid=' + $stateParams.pid).success(
                        function (result) {
                            if(result.code==1||result.code ==2){
                                $scope.addSuccess = true;
                                $timeout(function(){
                                    $scope.addSuccess = false;
                                },2000);
                            }
                        }
                    );
                }
            };

            //加入收藏夹
            $scope.addFavorite = function(){
                if(!$rootScope.uid){
                    $scope.$parent.jump('login');
                }else{
                    $http.get('data/favorite_addOrDelete.php?uid=' +
                    $rootScope.uid + '&pid=' + $stateParams.pid).success(
                        function (result) {
                            if(result.code==1){
                                $scope.isFavorite = true;
                            }
                            else if(result.code==2){
                                $scope.isFavorite = false;
                            }
                        }
                    );
                }
            };
        }
    ])
    .controller('loginCtrl',['$scope','$http','$rootScope',
        function($scope,$http,$rootScope){
            $scope.footerTabIndex = -1;
            $scope.isHome = true;
            $scope.login = function() {
                $http.get('data/user_login.php?unameOrPhone=' +
                $scope.uname + '&upwd=' + $scope.pwd).success(
                    function (result) {
                        if(result.code!=1){
                            $scope.error = "用户名或密码不正确";
                        }else{
                            $rootScope.isLogin = true;
                            $rootScope.uid= result.uid;
                            $rootScope.uname= result.uname;
                            $rootScope.phone= result.phone;
                            $scope.$parent.jump('index');
                        }
                    }
                );
            }
        }
    ])
    .controller('cartCtrl',['$scope','$rootScope','$http','$timeout',
        function($scope,$rootScope,$http,$timeout){
            $scope.footerTabIndex = 2;
            //显示购物车数据
            if($rootScope.uid) {
                $scope.$parent.updateCart();
            }
            else{
                $scope.$parent.jump('login');
            }

            //计算总计
            $scope.getSum = function(){
                $scope.sum = 0;
                for(var i=0;i<$scope.cartData.length;i++){
                    var obj = $scope.cartData[i];
                    if($scope.cartData[i].isChecked) {
                        var money = parseFloat(obj.price) * parseFloat(obj.pCount);
                        $scope.sum += money;
                    }
                }
            }

            //增加和减少数量
            $scope.decreaseCount=function(index){
                //将cartData 中相应cid的数量减1
                if($scope.cartData[index].pCount>0){
                    $scope.cartData[index].pCount--;
                    $scope.getSum();
                }
            };
            $scope.increaseCount=function(index){
                //将cartData 中相应cid的数量加1
                $scope.cartData[index].pCount++;
                $scope.getSum();
            };

            //选中购物车中某商品，计算总计
            $scope.sum = 0;
            $scope.operateCart = function(index,$event){
                $scope.cartData[index].isChecked = $event.target.checked;
                $scope.getSum();
            }
            //选中全选或者取消全选
            $scope.selectAllOperate = function($event){
                $scope.sum = 0;
                if($event.target.checked) {
                    for(var i=0;i<$scope.cartData.length;i++){
                        $scope.cartData[i].isChecked = true;
                        var obj = $scope.cartData[i];
                        var money = parseFloat(obj.price) * parseFloat(obj.pCount);
                        $scope.sum += money;
                    }
                }
            }
            //删除
            $scope.deleteCart = function(ctid,index){
                $http.get('data/cart_delete.php?ctid='+ctid)
                    .success(function(result){
                        if(result.code == 1)  {
                            $scope.cartData.splice(index,1);
                        }
                    });
            }
            //结算
            $scope.addSuccess = false;
            $scope.createOrder = function(){
                //收集选中的数据
                var postData = {
                    "uid": $rootScope.uid,
                    "price":0,
                    "data":[]
                };
                console.log($scope.cartData);
                for(var i=0;i<$scope.cartData.length;i++){
                    if($scope.cartData[i].isChecked){
                        postData.data.push({"pid":$scope.cartData[i].pid, "count":$scope.cartData[i].pCount,"price":$scope.cartData[i].price});
                        postData.price += parseInt($scope.cartData[i].pCount) * parseFloat($scope.cartData[i].price);
                    }
                }
                console.log(postData);
                $http({
                    method:'POST',
                    url:'data/order.php',
                    headers:{
                        'Content-Type':'application/json'
                    },
                    data:postData
                }).success(function(req){
                    console.log(req);
                    if(req.code == 1){
                        //更新购物车显示
                        $scope.$parent.updateCart();
                        $scope.addSuccess = true;
                        $timeout(function(){
                            $scope.addSuccess = false;
                        },2000);
                    }
                })
            };

        }
    ])
    .controller('userCtrl',['$scope','$http','$rootScope',
        function($scope,$http,$rootScope){
            $scope.footerTabIndex = 3;
            //显示购物车数据作为我的关注，显示收藏夹数据，显示订单数据
            $rootScope.uid = 1;
            if($rootScope.uid) {
                $scope.$parent.updateCart();
                $http.get('data/favorite_search.php?uid=' + $rootScope.uid)
                    .success(function (result) {
                        //每一行显示2个课程
                        $scope.favoriteData = [];
                        for(var i=0;i<=result.data.length/2;i++){
                            $scope.favoriteData[i] = [];
                            for(var j=0;j<2;j++){
                                $scope.favoriteData[i][j] = result.data[i*2+j];
                            }
                        }
                        $scope.favoriteCount = result.data.length;
                    });

                $http.get('data/order_select.php?uid=' + $rootScope.uid)
                    .success(function (result) {
                        console.log(result);
                        //按订单号分组
                        $scope.orderData = [];
                        for(var i=0;i<result.data.length;i++){
                            var oid = result.data[i].oid;
                            var isHave = false;
                            var oidIndex = 0;
                            for (var j = 0; j < $scope.orderData.length; j++) {
                                if ($scope.orderData[j].oid == oid) {
                                    isHave = true;
                                    oidIndex = j;
                                    break;
                                }
                            }

                            if(isHave)
                                $scope.orderData[oidIndex].details.push(result.data[i]);
                            else
                                $scope.orderData.push({
                                    oid: oid,
                                    address:result.data[i].address,
                                    price:result.data[i].totalprice,
                                    createTime:result.data[i].createtime,
                                    details: [result.data[i]]
                                });
                        }
                        $scope.orderCount = $scope.orderData.length;
                    });
            }
            else{
                $scope.$parent.jump('login');
            }
        }
    ])
    .controller('settingsCtrl',['$scope','$rootScope',
        function($scope,$rootScope){
            $scope.exit = function(){
                $rootScope.isLogin = false;
                $rootScope.uid = null;
                $scope.$parent.jump('index');
            };
    }])
    .controller('searchCtrl',['$scope','$rootScope','$http',
        function($scope,$rootScope,$http){
            //搜索
            $scope.inputTxt = {kw:''};
            $scope.$watch('inputTxt.kw', function () {
                $scope.search();
            })

            $scope.search = function(){
                if($scope.inputTxt.kw)
                {
                    $http
                        .get('data/product_search.php?kw='+$scope.inputTxt.kw)
                        .success(function (result) {
                            $scope.searchList = result.data;
                        })
                }
            };

        }])