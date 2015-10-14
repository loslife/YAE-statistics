app.controller('dakaQjcPhotoCtrl', ['$rootScope', '$scope', '$http', 'utilsService', function ($rootScope, $scope, $http, utilsService) {

    (function init() {
        initPic();
    })();

    function initPic(){
        $scope.photo_result_x = [0,0,0,0,0];
        $scope.photo_result_y = [0,0,0,0,0];

        //默认参数
        $scope.photo = {
            recentPhoto: 20,
        };

        //数据缓存
        var picDataCacheX = {};
        var picDataCacheY = {};

        //获取上传图片参数
        function qjcPicCount(num) {

            if(picDataCacheX[num] && picDataCacheY[num]){
                $scope.photo_result_x = picDataCacheX[num];
                $scope.photo_result_y = picDataCacheY[num];
                return;
            }

            $http.get("/svc/dakatongji/getNewestActivity").success(function (data) {

                $scope.no = data.result.no;
                $http.get("/svc/dakatongji/qjcPicCount?num=" + num).success(function (data) {

                    var details = data.result.details;
                    var rs = utilsService.formatData(details, $scope.no, $scope.photo.recentPhoto);
                    var ls = utilsService.getFormatData(details, "count");

                    picDataCacheX[num] = rs;
                    picDataCacheY[num] = ls;

                    $scope.photo_result_x = rs;
                    $scope.photo_result_y = ls;

                }).error(function (data, status) {
                    console.log("qjcPicCount in error");
                });

            }).error(function (data, status) {
                console.log("qjcPicCount in error");
            });
        }

        qjcPicCount($scope.photo.recentPhoto);

        //监听上传图片参数变化
        $scope.$watch('photo', function (newVal, oldVal) {
            if (newVal !== oldVal && newVal.recentPhoto !== oldVal.recentPhoto) {
                if (!newVal.recentPhoto || newVal.recentPhoto < 1 || newVal.recentPhoto > $scope.no) {
                    return;
                }
                qjcPicCount($scope.photo.recentPhoto);
            }
        }, true);
    }

}]);