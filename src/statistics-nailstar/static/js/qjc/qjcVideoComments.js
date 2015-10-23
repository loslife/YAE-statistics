app.controller('dakaqjcvideocomments', ['$rootScope', '$scope', '$http', 'utilsService', function ($rootScope, $scope, $http, utilsService) {

    (function init() {
        initVote();
    })();

    function initVote(){
        $scope.comments_result_x = [0,0,0,0,0];
        $scope.comments_result_y = [0,0,0,0,0];

        //默认参数
        $scope.CommentsParams = {
            num: 20,
        };

        //数据缓存
        var commentsDataCacheX = {};
        var commentsDataCacheY = {};

        //获取投票参数
        function getVote(num) {

            if(commentsDataCacheX[num] && commentsDataCacheY[num]){

                $scope.comments_result_x = commentsDataCacheX[num];
                $scope.comments_result_y = commentsDataCacheY[num];
                return;
            }

            $http.get("/svc/dakatongji/getNewestActivity").success(function (data) {

                $scope.no = data.result.no;
                $http.get("/svc/dakatongji/qjcCommentsCount?num=" + num).success(function (data) {

                    var details = data.result.details;
                    utilsService.formatDataByNo(details, $scope.no, $scope.CommentsParams.num);
                    var rs = utilsService.getFormatData(details, "no");
                    var ls = utilsService.getFormatData(details, "count");

                    commentsDataCacheX[num] = rs;
                    commentsDataCacheY[num] = ls;

                    $scope.comments_result_x = rs;
                    $scope.comments_result_y = ls;

                }).error(function (data, status) {

                    console.log("qjcVideoComments in error");

                });

            }).error(function (data, status) {

                console.log("qjcVideoComments in error");

            });
        }

        getVote($scope.CommentsParams.num);

        //监听投票参数变化
        $scope.$watch('CommentsParams', function (newVal, oldVal) {

            if (newVal !== oldVal && newVal.num !== oldVal.num) {
                if (!newVal.num || newVal.num < 1 || newVal.num > $scope.no) {
                    return;
                }
                getVote($scope.CommentsParams.num);
            }

        }, true);
    }
}]);