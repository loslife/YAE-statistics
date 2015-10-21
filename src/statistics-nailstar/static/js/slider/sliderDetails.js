app.controller('dakasliderdetails', ['$rootScope', '$scope', '$http', function ($rootScope, $scope, $http) {

    $rootScope.promise = $http.get("/svc/dakatongji/posters", {}).success(function(data) {

        $scope.infos = data.result;

    }).error(function(data, status) {

    });

}]);