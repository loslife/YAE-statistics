app.controller('dakavideoplaytopic', ['$rootScope', '$scope', '$http', 'utilsService', function ($rootScope, $scope, $http, utilsService) {

    (function init(){
        initCates();
    })();

    //系列播放统计
    function initCates(){
        //默认参数
        $scope.params = {
            topicId: null,//初始分类id
            order: "0",//初始维度
            num: 20,//初始数据数量
            changeNum: function(){
                getTopicPlayData($scope.params.topicId, $scope.params.order, $scope.params.num);
            },
            keyDown: function(){
                if(event.keyCode == 13){
                    $scope.params.changeNum();
                }
            }
        };

        $scope.play_result_x = [0,0,0,0,0];
        $scope.play_result_y = [0,0,0,0,0];

        //数据缓存
        var playDataCacheX = {};
        var playDataCacheY = {};

        //获取播放数据
        function getTopicPlayData(id, order, num){
            if(playDataCacheX[id + "_" + order + "_" + num] && playDataCacheY[id + "_" + order + "_" + num]){
                $scope.play_result_x = playDataCacheX[id + "_" + order + "_" + num];
                $scope.play_result_y = playDataCacheY[id + "_" + order + "_" + num];
                return;
            }

            var url = "/svc/dakatongji/getplayByTopic?topicId=" + id + "&order=" + order + "&num=" + num;
            $http.get(url).success(function(data) {

                utilsService.formatDataByOrderAndNum(data.result.details, order, num, ["count"]);
                var rs = utilsService.getFormatData(data.result.details, 'time');
                var ls = utilsService.getFormatData(data.result.details, 'count');

                rs = utilsService.tickFormatter(rs, order);
                playDataCacheX[id + "_" + order + "_" + num] = rs;
                $scope.play_result_x = rs;

                playDataCacheY[id + "_" + order + "_" + num] = ls;
                $scope.play_result_y = ls;

            }).error(function(data, status) {
                console.log("getplayByCate in error");
            });
        }

        //监听视频参数变化
        $scope.$watch('params', function (newVal, oldVal) {
            if (newVal.topicId !== oldVal.topicId || newVal.order !== oldVal.order) {
                if (!newVal.topicId || !newVal.order || newVal.num < 1) {
                    return;
                }
                getTopicPlayData($scope.params.topicId, $scope.params.order, $scope.params.num);
            }
        }, true);

        //获取分类数据
        function getTopics(){
            var url = "/svc/dakatongji/getTopics";
            $http.get(url).success(function(data) {
                $scope.topics = data.result.topics;
                if($scope.topics[0].id){
                    $scope.params.topicId = $scope.topics[0].id;
                    $scope.selectKind = $scope.topics[0].name;
                }
            }).error(function(data, status) {
                console.log("getTopics in error");
            });
        }
        getTopics();

        //修改分类数据
        $scope.changeTopic = function(item){
            $scope.params.topicId = item.id;
        };

    }
}]);