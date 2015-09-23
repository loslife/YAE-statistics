app.controller('dakaQjcPhotoCtrl', ['$rootScope', '$scope', '$http', 'utilsService', function ($rootScope, $scope, $http, utilsService) {


    $scope.photo_result_x = [0,0,0,0,0];
    $scope.photo_result_y = [0,0,0,0,0];

    //默认参数
    $scope.photo = {
        recentPhoto: 20,
    };

    $scope.refresh = Math.random();
    function refreshCanvas() {
        $scope.refresh = Math.random();
    }

    //格式化X轴数据
    function myformatDataX(details) {
        return _.map(details, function (el) {
            return el.no;
        }).reverse();
    }

    //格式化Y轴数据
    function myformatDataY(details) {
        return _.map(details, function (el) {
            return el.count;
        }).reverse();
    }

    //获取上传图片参数
    $scope.qjcPicCount = function (recentPhoto) {

        $http.get("/svc/dakatongji/qjcPicCount?num=" + recentPhoto).success(function (data) {

            var details = data.result.details;
            var photo_result_x = myformatDataX(details);
            var photo_result_y = myformatDataY(details);

            $scope.photo_result_x = photo_result_x;
            $scope.photo_result_y = photo_result_y;

            refreshCanvas();

        }).error(function (data, status) {

            console.log("qjcPicCount in error");

        });
    };

    //监听上传图片参数变化
    $scope.$watch('photo', function (newVal, oldVal) {
        if (newVal !== oldVal && newVal.recentPhoto !== oldVal.recentPhoto) {
            if (!newVal.recentPhoto || newVal.recentPhoto < 1 || newVal.recentPhoto > $scope.no) {
                return;
            }
            $scope.qjcPicCount($scope.photo.recentPhoto);
        }
    }, true);

    //获取视频最新活动期数
    function initPic() {
        $http.get("/svc/dakatongji/getNewestActivity").success(function (data) {

            $scope.no = data.result.no;
            $http.get("/svc/dakatongji/qjcPicCount?num=" + $scope.photo.recentPhoto).success(function (data) {

                var details = data.result.details;
                var photo_result_x = utilsService.formatDataX(details, $scope.no, $scope.photo.recentPhoto);
                var photo_result_y = utilsService.formatDataY(details, $scope.no, $scope.photo.recentPhoto);

                $scope.photo_result_x = photo_result_x;
                $scope.photo_result_y = photo_result_y;

                refreshCanvas();

            }).error(function (data, status) {
                console.log("qjcPicCount in error");
            });

        }).error(function (data, status) {
            console.log("qjcPicCount in error");
        });
    }

    (function init() {
        initPic();
    })();

}]);