app.controller('userDetailsCtrl', ['$rootScope', '$scope', '$http', function ($rootScope, $scope, $http) {

    $scope.remoteUrlRequestFn = function(str) {
        return {nickname: str};
    };

    $scope.userSelected = function(user){
        console.log(user.description.id);
    }

}]);