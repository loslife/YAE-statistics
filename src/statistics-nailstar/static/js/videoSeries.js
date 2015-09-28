app.controller('dakaPlayCtrl', ['$rootScope', '$scope', '$http', 'utilsService', function ($rootScope, $scope, $http, utilsService) {

    (function init(){
        initCates();
    })();

    //系列播放统计
    function initCates(){
        //默认参数
        $scope.CateParams = {
            cateId: null,//初始分类id
            order: "0",//初始维度
            num: 10,//初始数据数量
            refresh: null,
            showSpline: true,
        };

        $scope.cate_result_x = [0,0,0,0,0];
        $scope.cate_result_y = [0,0,0,0,0];

        //数据缓存
        var playDataCacheX = {};
        var playDataCacheY = {};

        //获取播放数据
        function getCatePlayData(id, order, num){
            if(playDataCacheX[id + "_" + order]){
                $scope.cate_result_x = playDataCacheX[id + "_" + order];
                $scope.cate_result_y = playDataCacheY[id + "_" + order];
                return;
            }
            var url = "/svc/dakatongji/getplayByCate?cate=" + id + "&order=" + order + "&num=" + num;
            $http.get(url).success(function(data) {
                var rs = utilsService.formatDataByOrderAndNumX(data.result.details, order, num);
                var ls = utilsService.formatDataByOrderAndNumY(data.result.details, order, num);
                playDataCacheX[id + "_" + order] = rs;
                playDataCacheY[id + "_" + order] = ls;
                $scope.cate_result_x = rs;
                $scope.cate_result_y = ls;
                //console.log(rs);
            }).error(function(data, status) {
                console.log("getplayByCate in error");
            });
        }

        getCatePlayData($scope.CateParams.cateId, $scope.CateParams.order, $scope.CateParams.num);

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