app.controller('dakaexpandcoin', ['$rootScope', '$scope', '$http', function ($rootScope, $scope, $http) {

    $rootScope.promise = $http.get("/svc/dakatongji/member/expAndCoinAnalyse", {}).success(function(data) {

        $scope.infos = data.result;

    }).error(function(data, status) {

    });

}]);