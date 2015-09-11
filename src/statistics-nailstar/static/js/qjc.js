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
    }

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

    $scope.qjcVoteCount($scope.vote.recentVote);

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

    $scope.qjcPicCount($scope.photo.recentPhoto);

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

    $scope.qjcVoteCount($scope.vote.recentVote);

    $scope.getNewestActivity = function(recentVote){
        $http.get("/svc/dakatongji/getNewestActivity?num=" + recentVote).success(function(data) {

            var details = data.result.details;
            var length = details.length;
            if(recentVote !== length){
                for(var i=0; i<recentVote; i++){
                    if(details[i].no == 21){
                        details[i].count == 0;
                    }
                }
            }

            $scope.vote_result = _.map(details, function(element){
                return [element.no, element.count];
            });
            console.log($scope.vote_result);

        }).error(function(data, status) {

            console.log("qjcVoteCount in error");

        });
    }

}]);