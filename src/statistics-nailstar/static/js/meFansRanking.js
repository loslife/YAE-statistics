app.controller('dakameFansRanking', ['$rootScope', '$scope', '$http', 'utilsService', function ($rootScope, $scope, $http, utilsService) {

    $rootScope.promise = $http.get("/svc/dakatongji/me/fansRanking", {}).success(function(data) {

        $scope.infos = data.result;

    }).error(function(data, status) {

    });
}]);