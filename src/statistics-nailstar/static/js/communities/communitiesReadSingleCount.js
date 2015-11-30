app.controller('communitiesReadSingleCount', ['$rootScope', '$scope', '$http', 'utilsService', function ($rootScope, $scope, $http, utilsService) {

    (function init(){
        initRead();
    })();

    //系列播放统计
    function initRead(){
        //默认参数
        $scope.CateParams = {
            id: null,//初始分类id
            num: 20,//初始数据数量
            changeNum: function(){
                getCommunitiesReadSingleData($scope.CateParams.id, $scope.CateParams.num);
            },
            keyDown: function(){
                if(event.keyCode == 13){
                    $scope.CateParams.changeNum();
                }
            }
        };

        $scope.result_x = [0,0,0,0,0];
        $scope.result_y = [0,0,0,0,0];

        //数据缓存
        var dataCacheX = {};
        var dataCacheY = {};

        //获取播放数据
        function getCommunitiesReadSingleData(id, num){
            if(dataCacheX[id + "_" + num] && dataCacheY[id + "_" + num]){
                $scope.result_x = dataCacheX[id + "_" + num];
                $scope.result_y = dataCacheY[id + "_" + num];
                return;
            }

            var url = "/svc/dakatongji/communities/communitiesReadSingleCount?id=" + id + "&num=" + num;
            $http.get(url).success(function(data) {

                utilsService.formatDataByOrderAndNum(data.result, 0, num, ["count"]);
                var rs = utilsService.getFormatData(data.result, 'time');
                var ls = utilsService.getFormatData(data.result, 'count');

                dataCacheX[id + "_" + num] = rs;
                $scope.result_x = rs;

                dataCacheY[id + "_" + num] = ls;
                $scope.result_y = ls;

            }).error(function(data, status) {
                console.log("getCommunitiesReadSingleData in error");
            });
        }

        //监听视频参数变化
        $scope.$watch('CateParams', function (newVal, oldVal) {
            if (newVal.id !== oldVal.id) {
                getCommunitiesReadSingleData($scope.CateParams.id, $scope.CateParams.num);
            }
        }, true);

        //获取分类数据
        function getAllcommunities(){
            var url = "/svc/dakatongji/communities/getAllcommunities";
            $http.get(url).success(function(data) {
                $scope.communities = data.result;
                if($scope.communities[0].id){
                    $scope.CateParams.id = $scope.communities[0].id;
                    //设置下拉菜单初始选项
                    $scope.community = {selected: $scope.communities[0]};
                }
            }).error(function(data, status) {
                console.log("getAllcommunities in error");
            });
        }
        getAllcommunities();

        $scope.selectKind = '请选择一个分类';

        //修改分类数据
        $scope.changeCommunity = function(item){
            $scope.CateParams.id = item.id;
        };

    }
}]);