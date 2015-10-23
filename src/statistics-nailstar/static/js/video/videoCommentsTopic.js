app.controller('videocommentstopic', ['$rootScope', '$scope', '$http', 'utilsService', function ($rootScope, $scope, $http, utilsService) {

    (function init(){
        initCates();
    })();

    //系列播放统计
    function initCates(){
        //默认参数
        $scope.params = {
            topicId: null,//初始主题id
            order: "0",//初始维度
            num: 20,//初始数据数量
            changeNum: function(){
                getTopicsPlayData($scope.params.topicId, $scope.params.order, $scope.params.num);
            },
            keyDown: function(){
                if(event.keyCode == 13){
                    $scope.params.changeNum();
                }
            }
        };

        $scope.comment_result_x = [0,0,0,0,0];
        $scope.comment_result_y = [0,0,0,0,0];

        //数据缓存
        var commentDataCacheX = {};
        var commentDataCacheY = {};

        //获取评论数据
        function getTopicsPlayData(id, order, num){
            if(commentDataCacheX[id + "_" + order + "_" + num] && commentDataCacheY[id + "_" + order + "_" + num]){
                $scope.comment_result_x = commentDataCacheX[id + "_" + order + "_" + num];
                $scope.comment_result_y = commentDataCacheY[id + "_" + order + "_" + num];
                return;
            }

            var url = "/svc/dakatongji/getCommentsByTopic?topicId=" + id + "&order=" + order + "&num=" + num;
            $http.get(url).success(function(data) {

                utilsService.formatDataByOrderAndNum(data.result.details, order, num, ["count"]);
                var rs = utilsService.getFormatData(data.result.details, 'time');
                var ls = utilsService.getFormatData(data.result.details, 'count');

                rs = utilsService.tickFormatter(rs, order);
                commentDataCacheX[id + "_" + order + "_" + num] = rs;
                $scope.comment_result_x = rs;

                commentDataCacheY[id + "_" + order + "_" + num] = ls;
                $scope.comment_result_y = ls;
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
                getTopicsPlayData($scope.params.topicId, $scope.params.order, $scope.params.num);
            }
        }, true);

        //获取分类数据
        function getTopics(){
            var url = "/svc/dakatongji/getTopics";
            $http.get(url).success(function(data) {
                $scope.topics = data.result.topics;
                if($scope.topics[0].id){
                    $scope.params.topicId = $scope.topics[0].id;
                    //设置下拉菜单初始选项
                    $scope.topic = {selected: $scope.topics[0]};
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