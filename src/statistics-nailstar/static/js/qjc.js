app.controller('dakaQjcCtrl', ['$rootScope', '$scope', '$http', function ($rootScope, $scope, $http) {

    //$scope.pic_result = [];
    //$scope.vote_result = [];

    $scope.vote = {
        recentVote: 10,
        showVoteSpline: true
    };

    $scope.photo = {
        recentPhoto: 10,
        showPicSpline: true
    };

    $scope.qjcVoteCount = function (recentVote){

        $http.get("/svc/dakatongji/qjcVoteCount?num=" + recentVote).success(function(data) {

            var details = data.result.details;

            $scope.vote_result = _.map(details, function(element){
                return [element.no, element.count];
            });
            resetRefresh();
            console.log($scope.vote_result);

        }).error(function(data, status) {

            console.log("qjcVoteCount in error");

        });
    };


    $scope.$watch('vote',function(newVal,oldVal){
        if(newVal !== oldVal && newVal.recentVote !== oldVal.recentVote){
            $scope.qjcVoteCount($scope.vote.recentVote);
        }
        if(newVal !== oldVal && newVal.showVoteSpline !== oldVal.showVoteSpline){
            resetRefresh();
        }
    },true);

    $scope.qjcPicCount = function (recentPhoto){
        $http.get("/svc/dakatongji/qjcPicCount?num=" + recentPhoto).success(function(data) {

            var details = data.result.details;

            $scope.pic_result = _.map(details, function(element){
                return [element.no, element.count];
            });
            resetRefresh();
            console.log($scope.pic_result);

        }).error(function(data, status) {

            console.log("qjcPicCount in error");

        });
    };


    $scope.$watch('photo',function(newVal,oldVal){
        if(newVal !== oldVal && newVal.recentPhoto !== oldVal.recentPhoto){
            $scope.qjcPicCount($scope.photo.recentPhoto);
        }
        if(newVal !== oldVal && newVal.showPicSpline !== oldVal.showPicSpline){
            resetRefresh();
        }
    },true);


    function resetRefresh(){
        $scope.refresh = Math.random();
    }

    (function init(){

    })();
    function initPic(){

    }
    //获取最新活动期数
    function initVote(){
        $http.get("/svc/dakatongji/getNewestActivity").success(function(data) {

            $scope.no = data.result.no;
            $http.get("/svc/dakatongji/qjcVoteCount?num=" + $scope.vote.recentVote).success(function(data) {

                var details = data.result.details;
                $scope.vote_result = _formatData(details, $scope.no, $scope.vote.recentVote);
                resetRefresh();
                console.log($scope.vote_result);

            }).error(function(data, status) {

                console.log("qjcVoteCount in error");

            });

        }).error(function(data, status) {

            console.log("qjcVoteCount in error");

        });
    }


    //数据格式化
    function _formatData(details, no, num){
        var length = details.length;
        if(num == length){
            return _.map(details, function(el){
                return [el.no, el.count];
            });
        }
        for(var i=0; i<num; i++){
            var flag = true;
            for(var j=0; j<details.length; j++){
                var detail = details[j];
                if(detail.no === (no - i)){
                    flag = false;
                    break;
                }
            }
            if(flag){
                details.splice(i, 0, {no: no - i,count: 0});
            }
        }
        return _.map(details, function(el){
            return [el.no, el.count];
        });
    }

}]);