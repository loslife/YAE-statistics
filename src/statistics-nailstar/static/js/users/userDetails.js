app.controller('userDetailsCtrl', ['$rootScope', '$scope', '$http', '$stateParams', function ($rootScope, $scope, $http, $stateParams) {

    $scope.initialValue = {
        id: $stateParams.id,
        username: $stateParams.username,
        nickname: $stateParams.nickname
    };

    $scope.remoteUrlRequestFn = function(str) {
        return {nickname: str};
    };

    $scope.userSelected = function(user){
        console.log(user.originalObject.id);

        $http.get("/svc/dakatongji/findUserDetails" + nickname).success(function (data) {


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