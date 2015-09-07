app.controller('dakaPlayCtrl', ['$rootScope', '$scope', '$http', function ($rootScope, $scope, $http) {

    $rootScope.promise = $http.get("/svc/dakatongji/play", {}).success(function(data) {

        $scope.totalCount = data.result.totalCount;
        $scope.details = data.result.details;

    }).error(function(data, status) {

    });

}]);