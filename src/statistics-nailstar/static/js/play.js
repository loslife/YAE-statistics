app.controller('dakaPlayCtrl', ['$rootScope', '$scope', '$http', 'utilsService', function ($rootScope, $scope, $http, utilsService) {

    (function init(){
        initCates();
        initNo();
    })();

    //分期播放统计
    function initNo(){
        //默认参数
        $scope.noParams = {
            num: 10,//初始数据数量
            refresh: null,
            showSpline: true,
            changeNum: function(){
                getNoPlayData($scope.noParams.num);
            },
            keyDown: function(){
                if(event.keyCode == 13){
                    $scope.noParams.changeNum();
                }
            }
        };
        $scope.no_result = [];

        //监听参数变化
        $scope.$watch('noParams', function(newVal, oldVal){
            //if (newVal && (newVal !== oldVal) && (newVal.num !== oldVal.num)) {
            //    getNoPlayData(newVal.num);
            //}
            if((newVal !== oldVal) && newVal && newVal.showSpline !== oldVal.showSpline){
                resetRefresh();
            }
        }, true);

        var playDataCache = {};
        //获取播放数据
        function getNoPlayData(num){
            if(playDataCache[num]){
                $scope.no_result = playDataCache[num];
                resetRefresh();
                return;
            }
            var url = "/svc/dakatongji/getplayByNo?num=" + num;
            $http.get(url).success(function(data) {
                var rs = utilsService.formatDataByNo(data.result.details);
                console.log(rs);
                playDataCache[num] = rs;
                $scope.no_result = rs;
                resetRefresh();
            }).error(function(data, status) {
                console.log("getplayByCate in error");
            });
        }

        function resetRefresh(){
            $scope.noParams.refresh = Math.random();
        }

        getNoPlayData($scope.noParams.num);
    }

    //系列播放统计
    function initCates(){
        //默认参数
        $scope.CateParams = {
            cateId: null,//初始分类id
            order: "0",//初始维度
            num: 10,//初始数据数量
            refresh: null,
            showSpline: true
        };
        $scope.cate_result = [];

        //监听参数变化
        $scope.$watch('CateParams', function(newVal, oldVal){
            if (newVal && (newVal !== oldVal) &&
                (newVal.cateId !== oldVal.cateId || newVal.order !== oldVal.order || newVal.num !== oldVal.num)) {
                if(newVal.cateId){
                    getCatePlayData(newVal.cateId, newVal.order, newVal.num);
                }
            }
            if((newVal !== oldVal) && newVal && newVal.showSpline !== oldVal.showSpline){
                resetRefresh();
            }
        }, true);

        //数据缓存
        var playDataCache = {};
        //获取播放数据
        function getCatePlayData(id, order, num){
            if(playDataCache[id + "_" + order]){
                $scope.cate_result = playDataCache[id + "_" + order];
                resetRefresh();
                return;
            }
            var url = "/svc/dakatongji/getplayByCate?cate=" + id + "&order=" + order + "&num=" + num;
            $http.get(url).success(function(data) {
                var rs = utilsService.formatDataByOrderAndNum(data.result.details, order, num);
                playDataCache[id + "_" + order] = rs;
                //console.log(rs);
                $scope.cate_result = rs;
                resetRefresh();
            }).error(function(data, status) {
                console.log("getplayByCate in error");
            });
        }

        //获取分类数据
        function getCates(){
            var url = "/svc/dakatongji/getCategories";
            $http.get(url).success(function(data) {
                $scope.cates = data.result.cates;
                if($scope.cates[0].id){
                    $scope.CateParams.cateId = $scope.cates[0].id;
                    $scope.selectKind = $scope.cates[0].name;
                }
            }).error(function(data, status) {
                console.log("getCategories in error");
            });
        }
        getCates();

        function resetRefresh(){
            $scope.CateParams.refresh = Math.random();
        }

        $scope.kind = { isopen: false };
        $scope.selectKind = '请选择一个分类';

        //修改分类数据
        $scope.changeCate = function(id,name){
            $scope.CateParams.cateId = id;
            $scope.selectKind = name;
            $scope.kind.isopen = !$scope.kind.isopen;
        };

        $scope.myTickFormatter = function(val, axis){
            switch($scope.CateParams.order){
                case "0" :
                    return moment(val).format("YYYYMMDD");
                case "1" :
                    return moment(val).format("YYYY") + "第" + moment(val).week() + "周";
                case "2" :
                    return moment(val).format("YYYYMM");
                default :
                    return moment(val).format("YYYYMMDD");
            }
        };
    }
}]);