app.controller('dakaexpanalyse', ['$rootScope', '$scope', '$http', function ($rootScope, $scope, $http) {

    (function init(){
        initCommunitiesRanking();
    })();

    function initCommunitiesRanking(){

        $scope.CateParams = {
            target : 0,
            num : 20
        };

        $scope.cates = [
            {id: "0", name: "打开APP"},
            {id: "1", name: "评论主题"},
            {id: "2", name: "交作业"},
            {id: "3", name: "分享"},
            {id: "4", name: "求教程"},
            {id: "5", name: "求教程拉票"},
            {id: "6", name: "创建圈子"},
            {id: "7", name: "圈子发表帖子"},
            {id: "8", name: "圈子回复帖子"},
            {id: "9", name: "注册"},
            {id: "10", name: "上传头像"},
            {id: "11", name: "填写手机号"},
        ];

        $scope.selectKind = $scope.cates[0].name;

        function getCateCommunities(id, num){
            $http.get("/svc/dakatongji/member/targetRanking?target=" + id + '&num=' + num, {}).success(function(data) {

                $scope.infos = data.result;

            }).error(function(data, status) {

            });
        }

        getCateCommunities($scope.CateParams.target, $scope.CateParams.num)

        //监听视频参数变化
        $scope.$watch('CateParams', function (newVal, oldVal) {
            if (newVal.target !== oldVal.target ) {
                if (!newVal.target ||  newVal.num < 1) {
                    return;
                }
                getCateCommunities($scope.CateParams.target, $scope.CateParams.num)
            }
        }, true);


        //修改分类数据
        $scope.changeCate = function(id, name){
            $scope.CateParams.target = id;
            $scope.selectKind = name;
        }
    }
}]);