app.controller('dakauserpostcommentranking', ['$rootScope', '$scope', '$http', function ($rootScope, $scope, $http) {

    $rootScope.promise = $http.get("/svc/dakatongji/postCommentRanking", {}).success(function(data) {

        $scope.infos = data.result;

    }).error(function(data, status) {

    });

}]);