
angular.module('iWebApp',['ionic','ngAnimate'])
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
            .state('cart', {
                url:'/cart',
                templateUrl: 'tpl/cart.html',
                controller:'cartCtrl'
            })
            .state('teacher', {
                url:'/teacher',
                templateUrl: 'tpl/teacher.html',
                controller:'teacherCtrl'
            })
            .state('list', {
                url:'/list/:typeNum',
                templateUrl: 'tpl/list.html',
                controller:'listCtrl'
            })
            .state('detail', {
                url:'/detail/:cid',
                templateUrl: 'tpl/detail.html',
                controller:'detailCtrl'
            })
            .state('login', {
                url:'/login',
                templateUrl: 'tpl/login.html',
                controller:'loginCtrl'
            })
            .state('user', {
                url:'/user',
                templateUrl: 'tpl/user.html',
                controller:'userCtrl'
            })
            .state('userInfo', {
                url:'/userInfo',
                templateUrl: 'tpl/userInfo.html',
                controller:'userInfoCtrl'
            });
        $urlRouterProvider.otherwise('start');
    })
    .controller('parentCtrl',
    ['$scope','$state','$ionicSideMenuDelegate','$ionicSlideBoxDelegate',
        '$ionicModal','$http','$rootScope',
        function ($scope,$state,$ionicSideMenuDelegate,$ionicSlideBoxDelegate,
                  $ionicModal,$http,$rootScope) {
            //跳转方法
            $scope.jump = function (arg) {
                    $state.go(arg);
            }
            //弹出搜索框
            $ionicModal.fromTemplateUrl('modal.html', {
                scope: $scope,
                animation: 'slide-in-right'
            }).then(function(result) {
                $scope.modal = result;
            });
            $scope.search = function() {
                $scope.modal.show();
            };

            //根据页数和课程类型获取课程数据
            $scope.getCourseData = function(num,type){
                $scope.$broadcast('scroll.infiniteScrollComplete');
                $http.get('php/course_select.php?type='+ type + '&pageNum=' + num).success(
                    function(result){
                        $scope.courseData = result;
                    }
                );
            };

            //页脚页签的选中状态
            $scope.footerTabIndex = 0;
            $scope.footerTabChanged = function(index){
                $scope.footerTabIndex = index;
            }

            //更新购物车的数据
            $scope.updateCart = function(){
                if($rootScope.uid) {
                    $http.get('php/cart_select.php?uid=' + $rootScope.uid)
                        .success(function (result) {
                            $scope.cartData = result.data;
                            $scope.cartCount = result.data.length;
                        });
                }
            };
        }
    ])
    .controller('startCtrl',['$scope','$timeout','$interval','$state',
        function($scope,$timeout,$interval,$state){
            $scope.secondNumber = 5;
            $timeout(function(){
                $state.go('index');
            },5000);
            $interval(function(){
                if($scope.secondNumber>0)
                    $scope.secondNumber--;
            },1000);
        }])
    .controller('indexCtrl',['$scope','$http','$timeout',
        function($scope,$http){
            //轮播数据
            $scope.imgList = ['images/banner01.jpg','images/banner02.jpg',
                'images/banner03.jpg','images/banner04.jpg' ];

            //获取最新课程数据
            $http.get('php/ind_new_course.php').success(function(result){
                $scope.newCourseList = result;
                $scope.hotCourseList = result.slice(1,3);
            });



            //获取师资数据
            $http.get('php/teachers_select.php').success(function(result){
                //每一行显示3位讲师
                $scope.teacherList = [];
                for(var i=0;i<=result.length/3;i++){
                    $scope.teacherList[i] = [];
                    for(var j=0;j<3;j++){
                        $scope.teacherList[i][j] = result[i*3+j];
                    }
                }
            });
        }
    ])
    .controller('listCtrl',['$scope','$http','$stateParams','$rootScope','$timeout',
        function($scope,$http,$stateParams,$rootScope,$timeout){
            $scope.footerTabIndex = 1;
            //获取所有类别数据
            $http.get('php/type_select.php').success(function(result){
                result.unshift({tpid:0,tpname:'不限'});
                $scope.courseTypeList = result;
            });
            //记载当前课程类型
            $rootScope.curType = $stateParams.typeNum || 0;
            //显示当前课程类型下的课程数据：此功能为多次调用的通用方法，定义到父控制器中
            $scope.$parent.getCourseData(1,$scope.curType);

            //加载更多功能
            $scope.hasMore = true;
            $scope.pageNum = 1;
            $scope.loadMore = function () {
                $scope.pageNum++;
                $timeout(function () {
                    $http.get('php/course_select.php?type='+ $rootScope.curType + '&pageNum=' + $scope.pageNum)
                        .success(function (newsData) {
                            if(newsData.data.length <3)
                            {
                                $scope.hasMore = false;
                            }
                            $scope.courseData.data = $scope.courseData.data.concat(newsData.data);

                            $scope.$broadcast('scroll.infiniteScrollComplete');
                        })
                },2000);
            };
        }])
    .controller('detailCtrl',['$scope','$http','$stateParams','$rootScope','$timeout',
        function($scope,$http,$stateParams,$rootScope,$timeout){
            //获取产品详细数据
            $http.get('php/course_detail.php?cid=' + $stateParams.cid).success(
                function(result){
                    $scope.course = result;
                }
            );
            //查询是否已经被收藏
            $http.get('php/favorite_select.php?uid=' +
                $rootScope.uid + '&cid=' + $stateParams.cid).success(
                    function(result){
                        $scope.isFavorite = result.code == 1?true:false;
                    }
            );
            //加入购物车
            $scope.addSuccess = false;
            $scope.addCart = function(){
                if(!$rootScope.uid){
                    $scope.$parent.jump('login');
                }else{
                    $http.get('php/cart_add.php?uid=' +
                    $rootScope.uid + '&cid=' + $stateParams.cid).success(
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
                    $http.get('php/favorite_addOrDelete.php?uid=' +
                    $rootScope.uid + '&cid=' + $stateParams.cid).success(
                        function (result) {
                            console.log(result)
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
        }])
    .controller('loginCtrl',['$scope','$http','$rootScope',
        function($scope,$http,$rootScope,$state){
            $scope.login = function() {
                $http.get('php/user_login.php?unameOrPhone=' +
                $scope.uname + '&upwd=' + $scope.pwd).success(
                    function (result) {
                        if(result.code!=1){
                            $scope.error = "用户名或密码不正确";
                        }else{
                            $rootScope.isLogin = true;
                            $rootScope.uid= result.uid;
                            $rootScope.uname= result.uname;
                            $rootScope.phone= result.phone;
                            $scope.$parent.jump('user');
                        }
                    }
                );
            }
        }
    ])
    .controller('userCtrl',['$scope','$http','$rootScope',
        function($scope,$http,$rootScope){
            $scope.footerTabIndex = 3;

            //显示购物车数据作为我的关注，显示收藏夹数据，显示订单数据
            if($rootScope.uid) {
                $scope.$parent.updateCart();
                $http.get('php/favorite_search.php?uid=' + $rootScope.uid)
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

                $http.get('php/order_select.php?uid=' + $rootScope.uid)
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
    .controller('teacherCtrl',['$scope','$http',
        function($scope,$http){

        }
    ])
    .controller('cartCtrl',['$scope','$http','$rootScope','$timeout',
        function($scope,$http,$rootScope,$timeout){
            $scope.footerTabIndex = 2;
            //显示购物车数据
            if($rootScope.uid) {
                $scope.$parent.updateCart();
            }
            else{
                $scope.$parent.jump('login');
            }

            //增加和减少数量
            $scope.decreaseCount=function(index){
                console.log(index);
                //将cartData 中相应cid的数量减1
                if($scope.cartData[index].courseCount>0)
                    $scope.cartData[index].courseCount--;
            };
            $scope.increaseCount=function(index){
                //将cartData 中相应cid的数量加1
                $scope.cartData[index].courseCount++;
            };

            //选中购物车中某商品，计算总计
            $scope.sum = 0;
            $scope.operateCart = function(index,$event){
                var obj = $scope.cartData[index];
                var money = parseFloat(obj.price) * parseFloat(obj.courseCount);
                if($event.target.checked)
                    $scope.sum += money;
                else
                    $scope.sum -= money;

                $scope.cartData[index].isChecked = $event.target.checked;
            }
            //选中全选或者取消全选
            $scope.selectAllOperate = function($event){
                $scope.sum = 0;
                if($event.target.checked) {
                    for(var i=0;i<$scope.cartData.length;i++){
                        var obj = $scope.cartData[i];
                        var money = parseFloat(obj.price) * parseFloat(obj.courseCount);
                        $scope.sum += money;
                    }
                }
            }
            //删除
            $scope.deleteCart = function(ctid,index){
                console.log(ctid);
                $http.get('php/cart_delete.php?ctid='+ctid)
                    .success(function(result){
                        console.log(result);
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
                for(var i=0;i<$scope.cartData.length;i++){
                    if($scope.cartData[i].isChecked){
                        postData.data.push({"cid":$scope.cartData[i].courseid, "count":$scope.cartData[i].courseCount,"price":$scope.cartData[i].price});
                        postData.price += parseInt($scope.cartData[i].courseCount) * parseFloat($scope.cartData[i].price);
                    }
                }
                console.log(postData);
                $http({
                    method:'POST',
                    url:'php/order.php',
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
    .controller('modalCtrl',['$scope','$http','$state',
        function($scope,$http,$state){
            //搜索
            $scope.$watch('kw', function () {
                if($scope.kw)
                {
                    $http.get('php/course_getbykw.php?kw='+$scope.kw)
                        .success(function(result){
                            $scope.searchResult = result;
                        });
                }
            })

            //带参数的跳转，跳转后，关闭弹出框
            $scope.jumpToDetail = function(courseid){
                $state.go('detail',{cid:courseid});
                $scope.modal.hide();
            }
    }])
    .controller('userInfoCtrl',['$scope','$http',
        function($scope,$http){

        }
    ])
