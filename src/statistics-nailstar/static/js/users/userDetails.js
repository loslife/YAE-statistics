app.controller('userDetailsCtrl', ['$rootScope', '$scope', '$http', function ($rootScope, $scope, $http) {

    $scope.remoteUrlRequestFn = function(str) {
        return {nickname: str};
    };

    $scope.userSelected = function(user){
        console.log(user.description.id);
    }

    //字符串处理
    function getQueryString(name) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
        var r =  decodeURIComponent(window.location.search).substr(1).match(reg);//转码使中文不是乱码
        if (r != null){
            return unescape(r[2]);
        }else{
            return false;//找不到就返回false
        }
    }

}]);