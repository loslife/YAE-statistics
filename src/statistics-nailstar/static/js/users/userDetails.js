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
            $scope.infos.userBirthdaty = moment($scope.infos.birthday).format("YYYY-MM-DD");//出生日期
            $scope.infos.userType = $scope.infos.type;//身份
            $scope.infos.userGender = $scope.infos.gender;//性别

            if($scope.infos.birthday){
                $scope.infos.userBirthdaty = moment($scope.infos.birthday).format("YYYY-MM-DD");//出生日期
            }else{
                $scope.infos.birthday = ' ';
            }

            if(!$scope.infos.creat_date){
                $scope.infos.creat_date = ' ';
            }

            var status = ['其他', '美甲老师','美甲消费者', '美甲从业者', '美甲师', '美甲店主', ''];
            var sex = ['男', '女', '其他'];

            if($scope.infos.type === 6){
                $scope.infos.userType = status[0];
            }else if($scope.infos.type === 5){
                $scope.infos.userType = status[1];
            }else if($scope.infos.type === 4){
                $scope.infos.userType = status[2];
            }else if($scope.infos.type === 3){
                $scope.infos.userType = status[3];
            }else if($scope.infos.type === 2){
                $scope.infos.userType = status[4];
            }else if($scope.infos.type === 1){
                $scope.infos.userType = status[5];
            }else if($scope.infos.type === 0){
                $scope.infos.userType = status[6];
            }

            if($scope.infos.gender === 2){
                $scope.infos.userGender = sex[0];
            }else if($scope.infos.gender === 1){
                $scope.infos.userGender = sex[1];
            }else if($scope.infos.gender === 0){
                $scope.infos.userGender = sex[2];
            }

        }).error(function (data, status) {

            console.log("userDetails in error");

        });
    };

}]);