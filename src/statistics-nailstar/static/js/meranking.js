app.controller('dakameranking', ['$rootScope', '$scope', '$http', 'utilsService', function ($rootScope, $scope, $http, utilsService) {

    (function init(){
        initNo();
    })();

    //分期播放统计
    function initNo(){
        //默认参数
        $scope.noParams = {
            num: 20,//初始数据数量
            changeNum: function(){
                getNoPlayData($scope.noParams.num);
            },
            keyDown: function(){
                if(event.keyCode == 13){
                    $scope.noParams.changeNum();
                }
            }
        };
        $scope.play_result_x = [0,0,0,0,0];
        $scope.play_result_y = [0,0,0,0,0];

        //数据缓存
        var playDataCacheX = {};
        var playDataCacheY = {};

        //获取播放数据
        function getNoPlayData(num){
            if(playDataCacheX[num] && playDataCacheY[num]){
                $scope.play_result_x = playDataCacheX[num];
                $scope.play_result_y = playDataCacheY[num];
                return;
            }
            var url = "/svc/dakatongji/me/fansRanking?num=" + num;
            $http.get(url).success(function(data) {

                console.log(data.result.details);

                var rs = utilsService.formatRankX(data.result);
                var ls = utilsService.formatRankY(data.result);

                console.log(rs);
                console.log(ls);

                playDataCacheX[num] = rs;
                playDataCacheY[num] = ls;
                $scope.play_result_x = rs;
                $scope.play_result_y = ls;
            }).error(function(data, status) {
                console.log("getplayByCate in error");
            });
        }

        getNoPlayData($scope.noParams.num);
    }
}]);