app.controller('dakaQjcCtrl', ['$rootScope', '$scope', '$http', 'utilsService', function ($rootScope, $scope, $http, utilsService) {


    $scope.pic_result = [];
    $scope.vote_result = [];

    $scope.vote_result_x = [0,0,0,0,0];
    $scope.vote_result_y = [0,0,0,0,0];

    //默认参数
    $scope.vote = {
        recentVote: 20,
        showVoteSpline: true
    };
    $scope.photo = {
        recentPhoto: 20,
        showPicSpline: true
    };

    $scope.refresh = Math.random();
    function refreshCanvas() {
        $scope.refresh = Math.random();
    }

    //获取投票参数
    $scope.qjcVoteCount = function (recentVote) {

        $http.get("/svc/dakatongji/qjcVoteCount?num=" + recentVote).success(function (data) {

            var details = data.result.details;
            console.log(details);
            var vote_result_x = myformatDataX(details);
            var vote_result_y = myformatDataY(details);
            $scope.vote_result_x = vote_result_x;
            $scope.vote_result_y = vote_result_y;
            console.log($scope.vote_result_x);
            console.log($scope.vote_result_y);

            refreshCanvas();


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
        if (newVal !== oldVal && newVal.showVoteSpline !== oldVal.showVoteSpline) {
            resetRefresh();
        }
    }, true);

    //获取上传图片参数
    $scope.qjcPicCount = function (recentPhoto) {
        $http.get("/svc/dakatongji/qjcPicCount?num=" + recentPhoto).success(function (data) {

            var details = data.result.details;

            $scope.pic_result = utilsService.formatData(details, $scope.no, $scope.photo.recentPhoto);
            resetRefreshPic();
            console.log($scope.pic_result);

        }).error(function (data, status) {

            console.log("qjcPicCount in error");

        });
    };

    //监听上传图片参数变化
    $scope.$watch('photo', function (newVal, oldVal) {
        if (newVal !== oldVal && newVal.recentPhoto !== oldVal.recentPhoto) {
            $scope.qjcPicCount($scope.photo.recentPhoto);
        }
        if (newVal !== oldVal && newVal.showPicSpline !== oldVal.showPicSpline) {
            resetRefreshPic();
        }
    }, true);

    //获取投票最新活动期数
    function initVote() {
        $http.get("/svc/dakatongji/getNewestActivity").success(function (data) {

            $scope.no = data.result.no;
            $http.get("/svc/dakatongji/qjcVoteCount?num=" + $scope.vote.recentVote).success(function (data) {

                var details = data.result.details;
                $scope.vote_result = utilsService.formatData(details, $scope.no, $scope.vote.recentVote);
                resetRefresh();
                console.log($scope.vote_result);

            }).error(function (data, status) {

                console.log("qjcVoteCount in error");

            });

        }).error(function (data, status) {

            console.log("qjcVoteCount in error");

        });
    }

    //获取上传图片最新活动期数
    function initPic() {
        $http.get("/svc/dakatongji/getNewestActivity").success(function (data) {
            $scope.no = data.result.no;
            $http.get("/svc/dakatongji/qjcPicCount?num=" + $scope.photo.recentPhoto).success(function (data) {

                var details = data.result.details;
                $scope.pic_result = utilsService.formatData(details, $scope.no, $scope.photo.recentPhoto);
                resetRefreshPic();
                console.log($scope.pic_result);

            }).error(function (data, status) {

                console.log("qjcPicCount in error");

            });
        }).error(function (data, status) {

            console.log("qjcPicCount in error");

        });
    }

    function myformatDataX(details) {
        return _.map(details, function (el) {
            return el.no;
        }).reverse();
    }

    function myformatDataY(details) {
        return _.map(details, function (el) {
            return el.count;
        }).reverse();
    }

    //产生随机数用于监听
    function resetRefresh() {
        $scope.refresh = Math.random();
    }

    function resetRefreshPic() {
        $scope.refreshPic = Math.random();
    }

    (function init() {
        //initVote();
        //initPic();
        var num = 20;
        $scope.qjcVoteCount(num);
    })();

}]);