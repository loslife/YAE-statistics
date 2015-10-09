app.controller('dakacommentsStage', ['$rootScope', '$scope', '$http', 'utilsService', function ($rootScope, $scope, $http, utilsService) {

    (function init(){
        initNo();
    })();

    //分期视频评论统计
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

        $scope.comments_stage_x = [0,0,0,0,0];
        $scope.comments_stage_y = [0,0,0,0,0];

        //数据缓存
        var commentsDataCacheX = {};
        var commentsDataCacheY = {};

        //获取评论数据
        function getNoPlayData(num){
            if(commentsDataCacheX[num] && commentsDataCacheY[num]){
                $scope.comments_stage_x = commentsDataCacheX[num];
                $scope.comments_stage_y = commentsDataCacheY[num];
                return;
            }
            var url = "/svc/dakatongji/getCommentsByNo?num=" + num;
            $http.get(url).success(function(data) {
                var rs = utilsService.formatDataByNoX(data.result.details);
                var ls = utilsService.formatDataByNoY(data.result.details);
                commentsDataCacheX[num] = rs;
                commentsDataCacheY[num] = ls;
                $scope.comments_stage_x = rs;
                $scope.comments_stage_y = ls;
            }).error(function(data, status) {
                console.log("getCommentsByCate in error");
            });
        }

        getNoPlayData($scope.noParams.num);
    }
}]);