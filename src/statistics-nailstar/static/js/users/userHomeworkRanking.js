app.controller('dakauserhomeworkranking', ['$rootScope', '$scope', '$http', function ($rootScope, $scope, $http) {

    $rootScope.promise = $http.get("/svc/dakatongji/homeworkRanking", {}).success(function(data) {

        $scope.infos = data.result;

    }).error(function(data, status) {

    });

}]);