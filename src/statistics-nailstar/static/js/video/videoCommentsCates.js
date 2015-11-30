app.controller('videocommentscates', ['$rootScope', '$scope', '$http', 'utilsService', function ($rootScope, $scope, $http, utilsService) {

    (function init(){
        initCommentsSeries();
    })();

    //系列播放统计
    function initCommentsSeries(){
        //默认参数
        $scope.CateParams = {
            cateId: null,//初始分类id
            order: "0",//初始维度
            num: 20,//初始数据数量
            changeNum: function(){
                getCatePlayData($scope.CateParams.cateId, $scope.CateParams.order, $scope.CateParams.num);
            },
            keyDown: function(){
                if(event.keyCode == 13){
                    $scope.CateParams.changeNum();
                }
            }
        };

        $scope.cate_result_x = [0,0,0,0,0];
        $scope.cate_result_y = [0,0,0,0,0];

        //数据缓存
        var commentsDataCacheX = {};
        var commentsDataCacheY = {};

        //获取播放数据
        function getCatePlayData(id, order, num){
            if(commentsDataCacheX[id + "_" + order + "_" + num] && commentsDataCacheY[id + "_" + order + "_" + num]){
                $scope.cate_result_x = commentsDataCacheX[id + "_" + order + "_" + num];
                $scope.cate_result_y = commentsDataCacheY[id + "_" + order + "_" + num];
                return;
            }

            var url = "/svc/dakatongji/getCommentsByCate?cate=" + id + "&order=" + order + "&num=" + num;
            $http.get(url).success(function(data) {

                utilsService.formatDataByOrderAndNum(data.result.details, order, num, ["count"]);
                var rs = utilsService.getFormatData(data.result.details, 'time');
                var ls = utilsService.getFormatData(data.result.details, 'count');

                rs = utilsService.tickFormatter(rs, order);
                commentsDataCacheX[id + "_" + order + "_" + num] = rs;
                $scope.cate_result_x = rs;

                commentsDataCacheY[id + "_" + order + "_" + num] = ls;
                $scope.cate_result_y = ls;

            }).error(function(data, status) {
                console.log("getplayByCate in error");
            });
        }

        //监听视频参数变化
        $scope.$watch('CateParams', function (newVal, oldVal) {
            if (newVal.cateId !== oldVal.cateId || newVal.order !== oldVal.order) {
                if (!newVal.cateId || !newVal.order || newVal.num < 1) {
                    return;
                }
                getCatePlayData($scope.CateParams.cateId, $scope.CateParams.order, $scope.CateParams.num);
            }
        }, true);

        //获取分类数据
        function getCates(){
            var url = "/svc/dakatongji/getCategories";
            $http.get(url).success(function(data) {
                $scope.cates = data.result.cates;
                if($scope.cates[0].id){
                    $scope.CateParams.cateId = $scope.cates[0].id;
                    $scope.selectKind = $scope.cates[0].name;
                }
            }).error(function(data, status) {
                console.log("getCategories in error");
            });
        }
        getCates();

        $scope.selectKind = '请选择一个分类';

        //修改分类数据
        $scope.changeCate = function(id,name){
            $scope.CateParams.cateId = id;
            $scope.selectKind = name;
        };

    }
}]);