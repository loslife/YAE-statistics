app.controller('dakacommunitiesstaticits', ['$rootScope', '$scope', '$http', function ($rootScope, $scope, $http) {

    $rootScope.promise = $http.get("/svc/dakatongji/communities/staticits", {}).success(function(data) {

        $scope.infos = data.result;

    }).error(function(data, status) {

    });

}]);