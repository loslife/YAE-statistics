app.controller('dakamelikeranking', ['$rootScope', '$scope', '$http', function ($rootScope, $scope, $http) {

    $rootScope.promise = $http.get("/svc/dakatongji/me/detailsLikeRanking", {}).success(function(data) {

        $scope.infos = data.result;

    }).error(function(data, status) {

    });

}]);