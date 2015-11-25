app.controller('communitiesCommentsCount', ['$rootScope', '$scope', '$http', 'utilsService', function ($rootScope, $scope, $http, utilsService) {

    (function init() {
        initCommentsCount();
    })();

    //每日圈子发帖数
    function initCommentsCount() {
        //默认参数
        $scope.params = {
            num: 20,
            totalCount: 0
        };

        $scope.result_x = [0, 0, 0, 0, 0];
        $scope.result_y = [0, 0, 0, 0, 0];

        //数据缓存
        var dataCacheX = {};
        var dataCacheY = {};

        getCommentsCountData($scope.params.num);

        //获取每日圈子发帖数
        function getCommentsCountData(num) {
            if (dataCacheX[num] && dataCacheY[num]) {
                $scope.result_x = dataCacheX[num];
                $scope.result_y = dataCacheY[num];
                return;
            }

            var url = "/svc/dakatongji/communities/communitiesCommentsCount?num=" + num;
            $http.get(url).success(function (data) {

                utilsService.formatDataByOrderAndNum(data.result, 0, num, ['count']);

                var rs = utilsService.getFormatData(data.result, "time");
                var ls = utilsService.getFormatData(data.result, 'count');

                dataCacheX[num] = rs;
                dataCacheY[num] = ls;

                $scope.result_x = rs;
                $scope.result_y = ls;

            }).error(function (data, status) {
                console.log("getCommentsCountData in error");
            });
        }

        //监听参数变化
        $scope.$watch('params', function (newVal, oldVal) {
            if (newVal !== oldVal || newVal.num !== oldVal.num) {
                getCommentsCountData($scope.params.num);
            }
        }, true);
    }

}]);