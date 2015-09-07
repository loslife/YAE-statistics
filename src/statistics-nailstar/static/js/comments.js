app.controller('dakaCommentsCtrl', ['$rootScope', '$scope', '$http', function ($rootScope, $scope, $http) {

    $rootScope.promise = $http.get("/svc/dakatongji/comments", {}).success(function(data) {

        $scope.totalCount = data.result.totalCount;
        $scope.details = data.result.details;

    }).error(function(data, status) {

    });

}]);