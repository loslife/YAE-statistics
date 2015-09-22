app.controller('dakaTestCtrl', ['$rootScope', '$scope', '$http', 'utilsService', function ($rootScope, $scope, $http, utilsService) {

    $scope.refresh = Math.random();
    function refreshCanvas() {
        $scope.refresh = Math.random();
    }

    function initData() {
        var arr = [];
        for (var i = 0; i < 6; i++) {
            arr.push(parseInt(Math.random() * 100));
        }
        return arr;
    }

    var data = initData();

    var data2 = initData();
    console.log(data);

    $http.get("/svc/dakatongji/qjcVoteCount?num=" + 10).success(function (data) {
        $scope.data = data;
        $scope.data2 = data2;
    }).error(function (data, status) {
    });

    $scope.data = [0,0,0,0,0];
    $scope.data2 = [0,0,0,0,0];

    $scope.changData = function () {
        var data = initData();
        var data2 = initData();
        console.log(data);
        $scope.data = data;
        $scope.data2 = data2;
        refreshCanvas();
    };

}]);