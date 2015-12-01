app.controller('meijiaCtrl', ['$rootScope', '$scope', '$http', 'utilsService','$location','$stateParams','$state', function ($rootScope, $scope, $http,utilsService,$location, $stateParams,$state) {

    //日期显示格式
    $scope.formats = ['dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];
    $scope.format = $scope.formats[1];

    //控制日历选择开始时间
    function startDatePick () {

        //获取今天的时间
        $scope.stoday = function() {
            $scope.sdt = new Date();
        };
        $scope.stoday();

        //清空时间
        $scope.sclear = function () {
          $scope.sdt = null;
        };

        //禁用周末选择
        $scope.disabled = function(date, mode) {
            return ( mode === 'day' && ( date.getDay() === 0 || date.getDay() === 6 ) );
        };

        // //日历最大和最小
        // $scope.stoggleMax = function() {
        //     $scope.smaxDate = $scope.smaxDate ? null : new Date();
        // };
        // $scope.stoggleMax();

        //打开
        $scope.sopen = function($event) {
            $event.preventDefault();
            $event.stopPropagation();

            $scope.sopened = true;
        };

        //日历初始化配置
        $scope.sdateOptions = {
            formatYear: 'yy',
            startingDay: 1,
            class: 'datepicker'
        };

    }

    //控制日历选择截止时间
    function endDatePick () {

        //获取今天的时间
        $scope.etoday = function() {
            $scope.edt = new Date();
        };
        $scope.etoday();

        //清空时间
        $scope.eclear = function () {
          $scope.sdt = null;
        };

        //禁用周末选择
        $scope.disabled = function(date, mode) {
            return ( mode === 'day' && ( date.getDay() === 0 || date.getDay() === 6 ) );
        };

        // //日历最大和最小
        // $scope.estoggleMin = function() {
        //     $scope.eminDate = $scope.smaxDate;
        //     $scope.emaxDate = new Date();
        // };
        // $scope.estoggleMin();

        //打开
        $scope.eopen = function($event) {
            $event.preventDefault();
            $event.stopPropagation();

            $scope.eopened = true;
        };

        //日历初始化配置
        $scope.edateOptions = {
            formatYear: 'yy',
            startingDay: 1,
            class: 'datepicker'
        };

    }

    startDatePick ();
    endDatePick ();
}]);