app.controller('showPicAndTxtCtrl', ['$rootScope', '$scope', '$http', 'utilsService','$location','$stateParams','$state', function ($rootScope, $scope, $http,utilsService,$location, $stateParams,$state) {

    (function init(){
        initCates();
    })();

    //系列播放统计
    function initCates(){
        $scope.data = {
            pictures:'',
            articles:''
        }
        console.log($stateParams.topicId);

        function getData (topicId) {
            
            var url = "/svc/dakatongji/topic/"+topicId;
            $http.get(url).success(function (data) {
                if(data.result.pictures.length == 0){
                    alert("没有图文！");
                    return;
                }
                $scope.data.pictures = data.result.pictures;
                $scope.data.articles = data.result.articles;
            });
        }

        getData($stateParams.topicId);

        $scope.goBack = function () {
            $state.go('app.videoPlayTopic', {
                
            });
        }
    }
}]);