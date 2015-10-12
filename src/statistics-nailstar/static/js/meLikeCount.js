app.controller('dakamelikecount', ['$rootScope', '$scope', '$http', 'utilsService', function ($rootScope, $scope, $http, utilsService) {

    (function init(){
        initComments();
    })();

    //分时播放统计
    function initComments(){
        //默认参数
        $scope.CommentsParams = {
            num : 20,
            totalcount: 0,
        }

        $scope.comments_result_x = [0,0,0,0,0];
        $scope.comments_result_y = [0,0,0,0,0];

        //数据缓存
        var commentsDataCacheX = {};
        var commentsDataCacheY = {};

        //获取评论数据
        function getCommentsData(num){
            if(commentsDataCacheX[num] && commentsDataCacheY[num]){
                $scope.comments_result_x = commentsDataCacheX[num];
                $scope.comments_result_y = commentsDataCacheY[num];
                return;
            }

            var url = "/svc/dakatongji/me/detailsLikeCount?num=" + num;
            $http.get(url).success(function(data){

                $scope.totalcount = data.result.totalCount;

                var rs =  utilsService.formatDataByDayX(data.result.details, num);
                var ls =  utilsService.formatDataByDayY(data.result.details, num);

                var rs = utilsService.tickFormatter(rs);

                commentsDataCacheX[num] = rs;
                commentsDataCacheY[num] = ls;
                $scope.comments_result_x = rs;
                $scope.comments_result_y = ls;

                console.log(rs);
                console.log(ls);
            }).error(function(data, status){
                console.log("getCommentsData in error");
            });
        }

        getCommentsData($scope.CommentsParams.num);

        //监听参数变化
        $scope.$watch('CommentsParams', function (newVal, oldVal) {
            if (newVal !== oldVal ||newVal.num !==oldVal.num) {
                if (!newVal.num || newVal.num > $scope.no) {
                    return;
                }
                getCommentsData($scope.CommentsParams.num);
            }
        }, true);
    }

}]);