app.controller('dakaPlayStage', ['$rootScope', '$scope', '$http', 'utilsService', function ($rootScope, $scope, $http, utilsService) {

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
            var url = "/svc/dakatongji/getplayByNo?num=" + num;
            $http.get(url).success(function(data) {

                var rs = utilsService.getFormatData(data.result.details, 'title');
                var ls = utilsService.getFormatData(data.result.details, 'count');

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