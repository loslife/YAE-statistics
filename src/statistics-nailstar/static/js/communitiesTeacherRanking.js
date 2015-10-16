app.controller('dakacommunitiesteacherranking', ['$rootScope', '$scope', '$http', function ($rootScope, $scope, $http) {



    (function init(){
        initTarget();
    })();

    function initTarget(){

        $scope.CateParams = {
            rankby : 0,
            num : 10
        };

        $scope.cates = [
            {id: "0", name: "按人数排名"},
            {id: "1", name: "按总话题数排行"},
            {id: "2", name: "按当日回复数排行"},
            {id: "3", name: "按当日进入数排行"},
        ];

        $scope.selectKind = $scope.cates[0].name;

        function getCateCommunities(id, num){
            $http.get("/svc/dakatongji/communities/teacherCommunitiesRanking?rankby=" + id + '&num=' + num, {}).success(function(data) {

                $scope.infos = data.result;

            }).error(function(data, status) {

            });
        }

        getCateCommunities($scope.CateParams.rankby, $scope.CateParams.num)

        //监听视频参数变化
        $scope.$watch('CateParams', function (newVal, oldVal) {
            if (newVal.rankby !== oldVal.rankby ) {
                if (!newVal.rankby ||  newVal.num < 1) {
                    return;
                }
                getCateCommunities($scope.CateParams.rankby, $scope.CateParams.num)
            }
        }, true);


        //修改分类数据
        $scope.changeCate = function(id, name){
            $scope.CateParams.rankby = id;
            $scope.selectKind = name;
        }
    }
}]);