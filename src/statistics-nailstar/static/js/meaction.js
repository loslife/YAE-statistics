app.controller('dakameaction', ['$rootScope', '$scope', '$http', function ($rootScope, $scope, $http) {

    $rootScope.promise = $http.get("/svc/dakatongji/me/statistics", {}).success(function(data) {

        $scope.infos = data.result.infos;

    }).error(function(data, status) {

    });

}]);