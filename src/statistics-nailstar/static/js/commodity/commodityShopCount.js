app.controller('commodityShopCount', ['$rootScope', '$scope', '$http', function ($rootScope, $scope, $http) {

    $rootScope.promise = $http.get("/svc/dakatongji/commodity/commodityShopCount", {}).success(function(data) {

        $scope.infos = data.result;

    }).error(function(data, status) {

    });

}]);