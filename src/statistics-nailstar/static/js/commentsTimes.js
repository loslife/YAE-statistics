app.controller('dakaCommentsCtrl', ['$rootScope', '$scope', '$http', 'utilsService', function ($rootScope, $scope, $http, utilsService) {

    (function init(){
        initComments();
    })();

    //分时播放统计
    function initComments(){
        //默认参数
        $scope.CommentsParams = {
            num : 20,
            order : "0",//初始维度
            totalCount : 0,
        }

        $scope.comments_result_x = [0,0,0,0,0];
        $scope.comments_result_y = [0,0,0,0,0];

        //数据缓存
        var commentsDataCacheX = {};
        var commentsDataCacheY = {};

        function tickFormatter(rs){
            var array = [];
            var formatFunction = getFormatFunction();
            for(var i = 0; i < rs.length; i++){
                array.push(formatFunction(rs[i]));
            }

            function getFormatFunction(){
                switch($scope.CommentsParams.order){
                    case "0" :
                        return function(val){
                            return moment(val).format("YYYYMMDD");
                        };
                    case "1" :
                        return function(val){
                            return moment(val).format("YYYY") + "第" + moment(val).week() + "周"
                        };
                    case "2" :
                        return function(val){
                            return moment(val).format("YYYYMM")
                        };
                    default :
                        return function(val){
                            return moment(val).format("YYYYMMDD")
                        };
                }
            }

            return array;
        }

        //获取评论数据
        function getCommentsData(order, num){
            if(commentsDataCacheX[num] && commentsDataCacheY[num]){
                $scope.comments_result_x = commentsDataCacheX[num];
                $scope.comments_result_y = commentsDataCacheY[num];
                return;
            }

            var url = "/svc/dakatongji/getCommentsByTime?order=" + order + "&num=" + num;
            $http.get(url).success(function(data){

                $scope.totalCount = data.result.totalCount;

                var rs =  utilsService.formatDataByOrderAndNumX(data.result.details, order, num);
                var ls =  utilsService.formatDataByOrderAndNumY(data.result.details, order, num);

                var rs = tickFormatter(rs);

                commentsDataCacheX[order] = rs;
                commentsDataCacheX[order] = ls;
                $scope.comments_result_x = rs;
                $scope.comments_result_y = ls;

                console.log(rs);
                console.log(ls);
            }).error(function(data, status){
                console.log("getCommentsData in error");
            });
        }


        //监听视频参数变化
        $scope.$watch('CommentsParams', function (newVal, oldVal) {
            if (newVal !== oldVal || newVal.order == oldVal.order ||newVal.num !==oldVal.num) {
                if (!newVal.order || newVal.num > $scope.no) {
                    return;
                }
                getCommentsData($scope.CommentsParams.order, $scope.CommentsParams.num);
            }
        }, true);
    }

}]);