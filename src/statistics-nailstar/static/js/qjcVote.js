app.controller('dakaQjcVoteCtrl', ['$rootScope', '$scope', '$http', 'utilsService', function ($rootScope, $scope, $http, utilsService) {


    $scope.vote_result_x = [0,0,0,0,0];
    $scope.vote_result_y = [0,0,0,0,0];

    //默认参数
    $scope.vote = {
        recentVote: 20,
    };

    //格式化X轴数据
    function myformatDataX(details) {
        return _.map(details, function (el) {
            return el.no;
        }).reverse();
    }

    //格式化Y轴数据
    function myformatDataY(details) {
        return _.map(details, function (el) {
            return el.count;
        }).reverse();
    }

    //获取投票参数
    $scope.qjcVoteCount = function (recentVote) {

        $http.get("/svc/dakatongji/qjcVoteCount?num=" + recentVote).success(function (data) {

            var details = data.result.details;
            var vote_result_x = myformatDataX(details);
            var vote_result_y = myformatDataY(details);

            $scope.vote_result_x = vote_result_x;
            $scope.vote_result_y = vote_result_y;

        }).error(function (data, status) {

            console.log("qjcVoteCount in error");

        });
    };

    //监听投票参数变化
    $scope.$watch('vote', function (newVal, oldVal) {
        if (newVal !== oldVal && newVal.recentVote !== oldVal.recentVote) {
            if (!newVal.recentVote || newVal.recentVote < 1 || newVal.recentVote > $scope.no) {
                return;
            }
            $scope.qjcVoteCount($scope.vote.recentVote);
        }
    }, true);

    //获取投票最新活动期数
    function initVote() {
        $http.get("/svc/dakatongji/getNewestActivity").success(function (data) {

            $scope.no = data.result.no;
            $http.get("/svc/dakatongji/qjcVoteCount?num=" + $scope.vote.recentVote).success(function (data) {

                var details = data.result.details;
                var vote_result_x = utilsService.formatDataX(details, $scope.no, $scope.vote.recentVote);
                var vote_result_y = utilsService.formatDataY(details, $scope.no, $scope.vote.recentVote);

                $scope.vote_result_x = vote_result_x;
                $scope.vote_result_y = vote_result_y;

            }).error(function (data, status) {

                console.log("qjcVoteCount in error");

            });

        }).error(function (data, status) {

            console.log("qjcVoteCount in error");

        });
    }

    (function init() {
        initVote();
    })();

}]);