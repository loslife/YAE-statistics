app.controller('dakaQjcCtrl', ['$rootScope', '$scope', '$http', function ($rootScope, $scope, $http) {

    //$scope.pic_result = [];
    //$scope.vote_result = [];

    $http.get("/svc/dakatongji/qjcPicCount?order=60").success(function(data) {

        var details = data.result.details;

        $scope.pic_result = _.map(details, function(element){
            return [element.date, element.count];
        });
        console.log($scope.pic_result);

    }).error(function(data, status) {

        console.log("qjcPicCount in error");

    });

    $http.get("/svc/dakatongji/qjcVoteCount?order=50").success(function(data) {

        var details = data.result.details;

        $scope.vote_result = _.map(details, function(element){
            return [element.date, element.count];
        });
        console.log($scope.vote_result);

    }).error(function(data, status) {

        console.log("qjcVoteCount in error");

    });

    //$scope.test = function(){
    //    alert(455);
    //}

}]);