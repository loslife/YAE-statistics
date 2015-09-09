app.controller('dakaQjcCtrl', ['$rootScope', '$scope', '$http', function ($rootScope, $scope, $http) {

    //$scope.pic_result = [];
    //$scope.vote_result = [];

    $scope.course = {
        recentVote: 10,
        recentPhoto: 10,
    };

    $scope.qjcPicCount = function (recentPhoto){
        $http.get("/svc/dakatongji/qjcPicCount?num=" + recentPhoto).success(function(data) {

            var details = data.result.details;

            $scope.pic_result = _.map(details, function(element){
                return [element.no, element.count];
            });
            console.log($scope.pic_result);

        }).error(function(data, status) {

            console.log("qjcPicCount in error");

        });
    };

    $scope.qjcPicCount($scope.course.recentPhoto);

    $scope.$watch('course',function(newVal,oldVal){
        if(newVal !== oldVal && newVal.recentPhoto !== oldVal.recentPhoto) {
            $scope.qjcPicCount($scope.course.recentPhoto);
        }
    },true);

    $scope.qjcVoteCount = function (recentVote){
        $http.get("/svc/dakatongji/qjcVoteCount?num=" + recentVote).success(function(data) {

            var details = data.result.details;

            $scope.vote_result = _.map(details, function(element){
                return [element.no, element.count];
            });
            console.log($scope.vote_result);

        }).error(function(data, status) {

            console.log("qjcVoteCount in error");

        });
    };

    $scope.$watch('course',function(newVal,oldVal){
        if(newVal !== oldVal && newVal.recentVote !== oldVal.recentVote){
            $scope.qjcVoteCount($scope.course.recentVote);
        }
    },true);

    $scope.qjcVoteCount($scope.course.recentVote);

    //$scope.test = function(){
    //    alert(455);
    //}

}]);