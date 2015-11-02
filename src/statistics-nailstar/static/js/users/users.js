app.controller('userCtrl', ['$rootScope', '$scope', '$http', function ($rootScope, $scope, $http) {

    $rootScope.promise = $http.get("/svc/dakatongji/users", {}).success(function(data) {

        $scope.infos = data.result.infos;

    }).error(function(data, status) {

    });

}]);