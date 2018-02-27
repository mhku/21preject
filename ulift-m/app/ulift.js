/**
 * Created by Administrator on 2016/11/28.
 */
angular.module('uliftApp',['ionic'])
    .config(function ($stateProvider,$urlRouterProvider,$ionicConfigProvider) {
        $ionicConfigProvider.tabs.position("bottom");

        $stateProvider
            .state('start', {
                url: '/start',
                templateUrl: 'tpl/start.html',
                controller:'startCtrl'
            })
            .state('advertise', {
                url: '/advertise',
                templateUrl: 'tpl/advertise.html',
                controller:'advertiseCtrl'
            })
            .state('index', {
                url: '/index',
                templateUrl: 'tpl/index.html',
                controller:'indexCtrl'
            })
            .state('list', {
                url:'/list/:typeNum',
                templateUrl: 'tpl/list.html',
                controller:'listCtrl'
            })
            .state('detail', {
                url:'/detail/:did',
                templateUrl: 'tpl/detail.html',
                controller:'detailCtrl'
            })
            .state('login', {
                url:'/login',
                templateUrl: 'tpl/login.html',
                controller:'loginCtrl'
            })
            .state('register', {
                url:'/register',
                templateUrl: 'tpl/register.html',
                controller:'registerCtrl'
            })
            .state('user', {
                url:'/user',
                templateUrl: 'tpl/user.html',
                controller:'userCtrl'
            })
            .state('news', {
                url:'/news',
                templateUrl: 'tpl/news.html',
                controller:'newsCtrl'
            })


            .state('search', {
                url:'/search',
                templateUrl: 'tpl/search.html',
                controller:'searchCtrl'
            });
        $urlRouterProvider.otherwise('start');
    })
    .controller('parentCtrl',
    ['$scope','$state','$ionicSideMenuDelegate','$ionicModal','$window','$rootScope','$http','$jsonOperate',
        function ($scope,$state,$ionicSideMenuDelegate,$ionicModal,$window,$rootScope,$http,$jsonOperate) {
            //跳转方法
            $scope.jump = function (arg) {
                $state.go(arg);
            }

            //页脚页签的选中状态,是否显示返回键
            $scope.footerTabIndex = 0;
            $scope.footerTabChanged = function(index){
                $scope.footerTabIndex = index;
            }

            //返回功能
            $scope.backWard = function(){
                $window.history.back();
                console.log(111);
            };

            //弹出设置框
            $ionicModal.fromTemplateUrl('m_city.html', {
                scope: $scope,
                animation: 'slide-in-up'
            }).then(function(modal) {
                $scope.cityModal = modal;
            });
            $scope.showCity = function() {
                $scope.cityModal.show();
            };
            $scope.closeCity = function() {
                $scope.cityModal.hide();
            };

            //判断当前用户是否登录
            $rootScope.isLogin = false;

            //根据页数和类型获取数据
            $scope.hasMore = true;
            $scope.listData = [];
            $scope.getListData = function(postData){
                //获取数据
                $http({
                    method:'POST',
                    url:'php/zf_list.php',
                    headers:{
                        'Content-Type':'application/x-www-form-urlencoded; charset=UTF-8'
                    },
                    data: $jsonOperate.getParams(postData)
                }).success(function(req){
                    //记载数据
                    $scope.listData = $scope.listData.concat(req.data);
                    $scope.pagerInfo = postData.pageNum +'/' + req.pageCount;
                    if(postData.pageNum == req.pageCount)
                    {
                        $scope.hasMore = false;
                    }
                })
            };
        }
    ])
    .controller('startCtrl',['$scope',
        function($scope){

        }])
    .controller('advertiseCtrl',['$scope','$timeout','$interval','$state',
        function($scope,$timeout,$interval,$state){
            //定时
            $scope.secondNumber = 10;
            $timeout(function(){
                $state.go('index');
            },10000);
            $interval(function(){
                if($scope.secondNumber>0)
                    $scope.secondNumber--;
            },1000);
            //轮播
            $scope.imgArray = ['images/01.jpg','images/02.jpg','images/03.jpg'];
        }])
    .controller('indexCtrl',['$scope','$http','$timeout','$ionicScrollDelegate',
        function($scope,$http,$timeout,$ionicScrollDelegate){
            //切换功能tab签及其内容
            $scope.tabIndex = 1;
            $scope.tabChanged = function(index){
                $scope.tabIndex = index;
            };
            $scope.footerTabIndex = 0;
            $scope.showHeader = false;

            //获取初始的新闻数据
            $scope.hasMore = true;
            $scope.pageNum = 1;
            $http.get('php/news_list.php?pageNum='+$scope.pageNum)
                .success(function (newsData) {
                    $scope.newsList = newsData.data;
                    $scope.pageNum++;
                });
            //加载更多
            $scope.loadMore = function () {
                $timeout(function () {//并非马上加载，而是2s后再加载
                    $http.get('php/news_list.php?pageNum='+$scope.pageNum)
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

            //上拉一定程度，显示header
            $scope.getScrollPosition = function(){
                var position=$ionicScrollDelegate.getScrollPosition().top;
                if (position<=100)//小于等于100像素时隐藏标题
                {
                    $scope.showHeader=false;
                }else{
                    $scope.showHeader=true;
                }
                $scope.$apply();
            };
        }
    ])
    .controller('listCtrl',['$scope','$http','$stateParams','$timeout','$jsonOperate',
        function($scope,$http,$stateParams,$timeout,$jsonOperate){
            $scope.footerTabIndex = 0;
            //切换显示方式
            $scope.showList = true;

            //获取数据
            $scope.houseKWData={
                pageNum:1,      //当前页码
                areaId:0,       //一级区域
                subAreaId:0,    //二级区域
                priceMin:0,     //最低租金
                priceMax:20000, //最高租金
                sizeMin:0,      //最小面积
                sizeMax:20000,  //最大面积
                houseType:0,    //房型
                leaseWay:0      //租赁方式
            };
            $scope.$parent.getListData($scope.houseKWData);

            //加载更多
            $scope.loadMore = function () {
                $timeout(function () {
                    $scope.houseKWData.pageNum++;
                    $scope.$parent.getListData($scope.houseKWData);
                        $scope.changeDataArray();
                        $scope.$broadcast('scroll.infiniteScrollComplete');
                    },2000);
            };

            //切换显示形式
            $scope.changeShowType = function(){
                $scope.showList = !$scope.showList;
                $scope.changeDataArray();
            };

            //更换数据结构
            $scope.houseArray = [];
            $scope.changeDataArray = function(){
                for(var i=0;i<$scope.listData.length/2;i++){
                    $scope.houseArray[i] = [];
                    for(var j=0;j<2;j++){
                        $scope.houseArray[i][j] = $scope.listData[i*2+j];
                    }
                }
            };

            //弹出区域选择框
            $scope.isShowArea = false;
            $scope.toggleArea = function(){
                $scope.isShowArea = !$scope.isShowArea;
            };
            $scope.hideArea = function(){
                $scope.isShowArea = false;
            };

            //初始化一级区域的数据
            $http.get('php/area_list.php').success(function(data){
                $scope.areaData = data;
            });

            //一级区域的单击事件：显示二级区域，并更新数据显示
            $scope.showSubArea = function(areaId){
                $scope.houseKWData.areaId = areaId;
                $scope.houseKWData.pageNum = 1;
                $scope.$parent.getListData($scope.houseKWData);
                if(areaId == 0)
                    return;
                $http.get('php/area_list_sub.php?areaId='+areaId).success(
                    function(data){
                        $scope.subAreaData = data;
                    });
            };

            //二级区域的单击事件：更新数据
            $scope.subAreaSelected = function(subAreaId){
                $scope.houseKWData.subAreaId = subAreaId;
                $scope.houseKWData.pageNum = 1;
                $scope.$parent.getListData($scope.houseKWData);
                $scope.isShowArea = false;
            };
        }])
    .controller('detailCtrl',['$scope','$http','$stateParams','$rootScope','$timeout',
        function($scope,$http,$stateParams,$rootScope,$timeout){
            $scope.footerTabIndex = 1;

            //获取产品详细数据
            $http.get('php/zf_details.php?zfId=' + $stateParams.did).success(
                function(result){
                    $scope.houseData = result;
                }
            );

            //地理定位
            var map = new BMap.Map("house_map");
            var geocoder = new BMap.Geocoder();
            geocoder.getPoint("北京市海淀区万寿路西街2号",function(point){
                //根据Point进行标注
                var marker = new BMap.Marker(point);
                map.addOverlay(marker);
                //重新设置中心点位置
                map.centerAndZoom(point,16);
                //marker.setAnimation(BMAP_ANIMATION_BOUNCE);
            },"北京");


            //价格走势绘图
            new Chart(house_chart, {
                type: 'line',
                data: {
                    labels: ['10月','11月','12月','1月','2月','3月'],
                    datasets: [{
                        label:'价格走势',
                        data:[8000,8500,9200,9000,10000,11000],
                        backgroundColor: [
                            'rgba(255, 99, 132, 0.2)',
                            'rgba(54, 162, 235, 0.2)',
                            'rgba(255, 206, 86, 0.2)',
                            'rgba(75, 192, 192, 0.2)',
                            'rgba(153, 102, 255, 0.2)',
                            'rgba(255, 159, 64, 0.2)'
                        ],
                        borderColor: [
                            'rgba(255, 99, 132, 1)',
                            'rgba(54, 162, 235, 1)',
                            'rgba(255, 206, 86, 1)',
                            'rgba(75, 192, 192, 1)',
                            'rgba(153, 102, 255, 1)',
                            'rgba(255, 159, 64, 1)'
                        ],
                        borderWidth: 1
                    }]
                },
                options: {
                    responsive: false,  //取消响应式
                    scales: {
                        yAxes: [{
                            ticks: {
                                beginAtZero:true //Y轴坐标点从0开始
                            }
                        }]
                    }
                }
            });

            //加入收藏夹
            $scope.favorite = function(zfId){
                if($rootScope.user == null){
                    $scope.$parent.jump('login');
                }else{
                    $http.get('php/favorite_addOrDelete.php?userId='+$rootScope.user.userId+'&zfId='+zfId)
                        .success(function(result){
                        });
                }
            };
        }
    ])
    .controller('loginCtrl',['$scope','$http','$rootScope',
        function($scope,$http,$rootScope){
            $scope.footerTabIndex = -1;

            //实现登录
            $scope.login = function() {
                $http.get('php/user_login.php?phone=' +
                $scope.phone + '&upwd=' + $scope.pwd).success(
                    function (result) {
                        $rootScope.user= result;
                        if(result.code==1){
                            $scope.$parent.jump('index');
                        }
                        else
                            $scope.error = "用户名或密码不正确";
                    }
                );
            }
        }
    ])
    .controller('registerCtrl',['$scope','$http','$rootScope',
        function($scope,$http,$rootScope){
            $scope.footerTabIndex = -1;
            $scope.login = function() {
                return;
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
    .controller('userCtrl',['$scope','$http','$rootScope',
        function($scope,$http,$rootScope){
            $scope.footerTabIndex = 3;
            //显示收藏夹数据

        }
    ])
    .controller('newsCtrl',['$scope','$http','$timeout',
        function($scope,$http,$timeout){
            $scope.footerTabIndex = 1;

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
                $scope.showList = !$scope.showList;
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

            //弹出区域选择框
            $scope.isShowArea = false;
            $scope.toggleArea = function(){
                $scope.isShowArea = !$scope.isShowArea;
            };
            $scope.hideArea = function(){
                $scope.isShowArea = false;
            };
        }])
    .controller('searchCtrl',['$scope','$rootScope','$http',
        function($scope,$rootScope,$http){
            return;
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
    .service('$jsonOperate', [function () {
        //实现json对象到键值对字符串的转换
        this.getParams = function (jsonObj) {
            var result = "";
            for(var p in jsonObj){
                result += p + '=' + jsonObj[p] + '&';
            }
            return result;
        }
    }])