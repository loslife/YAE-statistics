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
        $scope.play_result_y_details = [0,0,0,0,0];
        $scope.play_result_y_appDetails = [0,0,0,0,0];
        $scope.play_result_y_wechatDetails = [0,0,0,0,0];

        //数据缓存
        var playDataCacheX = {};
        var playDataCacheY_details = {};
        var playDataCacheY_appDetails = {};
        var playDataCacheY_wechatDetails = {};

        //获取评论数据
        function getCommentsData(order, num){
            if(playDataCacheX[order + "_" + num] && playDataCacheY_details[order + "_" + num] && playDataCacheY_appDetails[order + "_" + num] && playDataCacheY_wechatDetails[order + "_" + num]){
                $scope.play_result_x = playDataCacheX[order + "_" + num];
                $scope.play_result_y_details = playDataCacheY_details[order + "_" + num];
                $scope.play_result_y_appDetails = playDataCacheY_appDetails[order + "_" + num];
                $scope.play_result_y_wechatDetails = playDataCacheY_wechatDetails[order + "_" + num];
                return;
            }

            var url = "/svc/dakatongji/getplayAll?order=" + order + "&num=" + num;
            $http.get(url).success(function(data){

                $scope.totalCount = data.result.totalCount;

                utilsService.formatDataByOrderAndNum(data.result.details, order, num, ['count']);
                utilsService.formatDataByOrderAndNum(data.result.appDetails, order, num, ['count']);
                utilsService.formatDataByOrderAndNum(data.result.wechatDetails, order, num, ['count']);

                var rs =  utilsService.getFormatData(data.result.details, "time");
                var ls_details =  utilsService.getFormatData(data.result.details, 'count');
                var ls_appDetails =  utilsService.getFormatData(data.result.appDetails, "count");
                var ls_wechatDetails =  utilsService.getFormatData(data.result.wechatDetails, "count");

                rs = utilsService.tickFormatter(rs, order);

                playDataCacheX[order + "_" + num] = rs;
                playDataCacheY_details[order + "_" + num] = ls_details;
                playDataCacheY_appDetails[order + "_" + num] = ls_appDetails;
                playDataCacheY_wechatDetails[order + "_" + num] = ls_wechatDetails;

                $scope.play_result_x = rs;
                $scope.play_result_y_details = ls_details;
                $scope.play_result_y_appDetails = ls_appDetails;
                $scope.play_result_y_wechatDetails = ls_wechatDetails;

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