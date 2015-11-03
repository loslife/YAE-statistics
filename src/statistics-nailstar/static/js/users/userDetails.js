app.controller('userDetailsCtrl', ['$rootScope', '$scope', '$http', '$stateParams', function ($rootScope, $scope, $http, $stateParams) {

    if($stateParams.id && $stateParams.username && $stateParams.nickname){
        $scope.initialValue = {
            id: $stateParams.id,
            username: $stateParams.username,
            nickname: $stateParams.nickname
        };
    }

    $scope.remoteUrlRequestFn = function(str) {
        return {nickname: str};
    };

    $scope.userSelected = function(user){

        $http.get("/svc/dakatongji/findUserDetails?id=" + user.originalObject.id).success(function (data) {

            $scope.infos = data.result;

            if($scope.infos.birthday){
                $scope.infos.userBirthdaty = moment($scope.infos.birthday).format("YYYY-MM-DD");//出生日期
            }

            if($scope.infos.creat_date){
                $scope.infos.UserCreatedate = moment($scope.infos.creat_date).format("YYYY-MM-DD");//出生日期
            }

            var status = ['', '美甲店主', '美甲师', '美甲从业者', '美甲消费者', '美甲老师', '其他'];
            var sex = ['其他', '女', '男'];

            $scope.infos.userType = status[$scope.infos.type];

            $scope.infos.userGender = sex[$scope.infos.gender];

        }).error(function (data, status) {

            console.log("userDetails in error");

        });
    };

}]);