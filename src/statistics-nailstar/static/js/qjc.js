app.controller('dakaQjcCtrl', ['$rootScope', '$scope', '$http', 'utilsService', function ($rootScope, $scope, $http, utilsService) {

    $http.get("/svc/dakatongji/qjcPicCount?order=60").success(function(data) {

        var details = data.result.details;

        $scope.pic_result = utilsService.formatData(details);

        console.log($scope.pic_result);

    }).error(function(data, status) {

        console.log("qjcPicCount in error");

    });

    $http.get("/svc/dakatongji/qjcVoteCount?order=50").success(function(data) {

        var details = data.result.details;

        $scope.vote_result = utilsService.formatData(details);

        console.log($scope.vote_result);

    }).error(function(data, status) {

        console.log("qjcVoteCount in error");

    });

}]);