app.controller('dakaqjcvideoplay', ['$rootScope', '$scope', '$http', 'utilsService', function ($rootScope, $scope, $http, utilsService) {

    (function init() {
        qjcVideoPlay();
    })();

    function qjcVideoPlay(){
        $scope.play_result_x = [0,0,0,0,0];
        $scope.play_result_y = [0,0,0,0,0];

        //默认参数
        $scope.PlayParams = {
            num: 20,
        };

        //数据缓存
        var playDataCacheX = {};
        var playDataCacheY = {};

        //获取投票参数
        function getVote(num) {

            if(playDataCacheX[num] && playDataCacheY[num]){

                $scope.play_result_x = playDataCacheX[num];
                $scope.play_result_y = playDataCacheY[num];
                return;
            }

            $http.get("/svc/dakatongji/getNewestActivity").success(function (data) {

                $scope.no = data.result.no;
                $http.get("/svc/dakatongji/qjcPlayCount?num=" + num).success(function (data) {

                    var details = data.result.details;
                    utilsService.formatDataByNo(details, $scope.no, $scope.PlayParams.num);
                    var rs = utilsService.getFormatData(details, "no");
                    var ls = utilsService.getFormatData(details, "count");

                    playDataCacheX[num] = rs;
                    playDataCacheY[num] = ls;

                    $scope.play_result_x = rs;
                    $scope.play_result_y = ls;

                }).error(function (data, status) {

                    console.log("qjcVideoPlay in error");

                });

            }).error(function (data, status) {

                console.log("qjcVideoPlay in error");

            });
        }

        getVote($scope.PlayParams.num);

        //监听投票参数变化
        $scope.$watch('PlayParams', function (newVal, oldVal) {

            if (newVal !== oldVal && newVal.num !== oldVal.num) {
                if (!newVal.num || newVal.num < 1 || newVal.num > $scope.no) {
                    return;
                }
                getVote($scope.PlayParams.num);
            }

        }, true);
    }
}]);