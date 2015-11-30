app.controller('qjcVoteCtrl', ['$rootScope', '$scope', '$http', 'utilsService', function ($rootScope, $scope, $http, utilsService) {

    (function init() {
        initVote();
    })();

    function initVote(){
        $scope.vote_result_x = [0,0,0,0,0];
        $scope.vote_result_y = [0,0,0,0,0];

        //默认参数
        $scope.vote = {
            recentVote: 20,
        };

        //数据缓存
        var voteDataCacheX = {};
        var voteDataCacheY = {};

        //获取投票参数
        function getVote(num) {

            if(voteDataCacheX[num] && voteDataCacheY[num]){

                $scope.vote_result_x = voteDataCacheX[num];
                $scope.vote_result_y = voteDataCacheY[num];
                return;
            }

            $http.get("/svc/dakatongji/getNewestActivity").success(function (data) {

                $scope.no = data.result.no;
                $http.get("/svc/dakatongji/qjcVoteCount?num=" + num).success(function (data) {

                    var details = data.result.details;
                    utilsService.formatDataByNo(details, $scope.no, $scope.vote.recentVote);
                    var rs = utilsService.getFormatData(details, "no");
                    var ls = utilsService.getFormatData(details, "count");

                    voteDataCacheX[num] = rs;
                    voteDataCacheY[num] = ls;

                    $scope.vote_result_x = rs;
                    $scope.vote_result_y = ls;

                }).error(function (data, status) {

                    console.log("qjcVoteCount in error");

                });

            }).error(function (data, status) {

                console.log("qjcVoteCount in error");

            });
        }

        getVote($scope.vote.recentVote);

        //监听投票参数变化
        $scope.$watch('vote', function (newVal, oldVal) {

            if (newVal !== oldVal && newVal.recentVote !== oldVal.recentVote) {
                if (!newVal.recentVote || newVal.recentVote < 1 || newVal.recentVote > $scope.no) {
                    return;
                }
                getVote($scope.vote.recentVote);
            }

        }, true);
    }
}]);