app.controller('userDetailsCtrl', ['$rootScope', '$scope', '$http', function ($rootScope, $scope, $http) {

    var nickname = getQueryString("nickname");
    if(nickname){
        $scope.initialValue = nickname;
    }

    $scope.remoteUrlRequestFn = function(str) {
        return {nickname: str};
    };

    $scope.userSelected = function(user){
        console.log(user.description.id);

        $http.get("/svc/dakatongji/findUserDetails?id=" + user.description.id).success(function (data) {

            $scope.infos = data.result;
            $scope.birthday = moment($scope.infos.birthday).format("YYYY-MM-DD");//出生日期
            $scope.type = $scope.infos.type;//身份
            $scope.gender = $scope.infos.gender;//性别

            if($scope.infos.type === 6){
                $scope.type = '其他';
            }else if($scope.infos.type === 5){
                $scope.type = '美甲老师';
            }else if($scope.infos.type === 4){
                $scope.type = '美甲消费者';
            }else if($scope.infos.type === 3){
                $scope.type = '美甲从业者';
            }else if($scope.infos.type === 2){
                $scope.type = '美甲师';
            }else if($scope.infos.type === 1){
                $scope.type = '美甲店主';
            }

            if($scope.infos.gender === 2){
                $scope.gender = '男';
            }else if($scope.infos.gender === 1){
                $scope.gender = '女';
            }else if($scope.infos.gender === 0){
                $scope.gender = '其他';
            }

        }).error(function (data, status) {

            console.log("userDetails in error");

        });
    };

    //字符串处理
    function getQueryString(name) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
        var uri = decodeURIComponent(window.location.hash);
        var index = uri.indexOf("?");
        var r =  uri.substr(index).substr(1).match(reg);//转码使中文不是乱码
        if (r != null){
            return unescape(r[2]);
        }else{
            return false;//找不到就返回false
        }
    }

}]);