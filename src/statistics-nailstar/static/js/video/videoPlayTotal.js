app.controller('videoplaytotal', ['$rootScope', '$scope', '$http', 'utilsService', function ($rootScope, $scope, $http, utilsService) {

    (function init(){
        initPlayTotal();
    })();

    //分时播放统计
    function initPlayTotal(){
        //默认参数
        $scope.params = {
            num : 20,
            order : "0",//初始维度
            totalCount : 0
        };

        $scope.play_result_x = [0,0,0,0,0];
        $scope.play_result_y = [0,0,0,0,0];

        //数据缓存
        var playDataCacheX = {};
        var playDataCacheY = {};

        //获取评论数据
        function getCommentsData(order, num){
            if(playDataCacheX[order + "_" + num] && playDataCacheY[order + "_" + num]){
                $scope.play_result_x = playDataCacheX[order + "_" + num];
                $scope.play_result_y = playDataCacheY[order + "_" + num];
                return;
            }

            var url = "/svc/dakatongji/getplayAll?order=" + order + "&num=" + num;
            $http.get(url).success(function(data){

                $scope.totalCount = data.result.totalCount;

                utilsService.formatDataByOrderAndNum(data.result.details, order, num, ['count']);
                var rs =  utilsService.getFormatData(data.result.details, "time");
                var ls =  utilsService.getFormatData(data.result.details, 'count');

                rs = utilsService.tickFormatter(rs, order);

                playDataCacheX[order + "_" + num] = rs;
                playDataCacheY[order + "_" + num] = ls;
                $scope.play_result_x = rs;
                $scope.play_result_y = ls;

            }).error(function(data, status){
                console.log("getplayAll in error");
            });
        }

        //监听视频参数变化
        $scope.$watch('params', function (newVal, oldVal) {
            if (newVal !== oldVal || newVal.order == oldVal.order ||newVal.num !==oldVal.num) {
                if (!newVal.order || newVal.num > $scope.no) {
                    return;
                }
                getCommentsData($scope.params.order, $scope.params.num);
            }
        }, true);
    }

}]);