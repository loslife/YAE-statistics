app.controller('dakameFollowsRanking', ['$rootScope', '$scope', '$http', 'utilsService', function ($rootScope, $scope, $http, utilsService) {

    $rootScope.promise = $http.get("/svc/dakatongji/me/followsRanking", {}).success(function(data) {

        $scope.infos = data.result;

    }).error(function(data, status) {

    });
}]);