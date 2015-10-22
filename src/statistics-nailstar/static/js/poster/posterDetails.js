app.controller('posterdetails', ['$rootScope', '$scope', '$http', function($rootScope, $scope, $http) {

    $scope.filterOptions = {
        filterText: "",
        useExternalFilter: true
    };
    $scope.totalServerItems = 0;
    $scope.pagingOptions = {
        pageSizes: [20, 50, 100],
        pageSize: 20,
        currentPage: 1
    };
    $scope.setPagingData = function(data){
        console.log(data);
        $scope.myData = data;
        if (!$scope.$$phase) {
            $scope.$apply();
        }
    };
    $scope.getPagedDataAsync = function (pageSize, page) {
        $http.get('/svc/dakatongji/posters', {}).success(function (data) {
            $scope.setPagingData(data.result);
        });
    };
    $scope.getPagedDataAsync($scope.pagingOptions.pageSize, $scope.pagingOptions.currentPage);

    $scope.$watch('pagingOptions', function (newVal, oldVal) {
        if (newVal !== oldVal && newVal.currentPage !== oldVal.currentPage) {
            $scope.getPagedDataAsync($scope.pagingOptions.pageSize, $scope.pagingOptions.currentPage);
        }
    }, true);
    $scope.$watch('filterOptions', function (newVal, oldVal) {
        if (newVal !== oldVal) {
            $scope.getPagedDataAsync($scope.pagingOptions.pageSize, $scope.pagingOptions.currentPage);
        }
    }, true);
    $scope.columnDefs = [
        {field: 'name', displayName: '图片', cellTemplate: '<div style="width: 100px;height: 50px;"><img style="width: 110%" src="{{row.entity.picUrl}}" /></div>'},
        {field: 'create_date', displayName: '创建时间', cellTemplate: "<span style='margin-left:10px;'>{{row.entity.create_date}}</span>"},
        {field: 'end_date', displayName: '结束时间', cellTemplate: '<span style="margin-left:10px">{{row.entity.end_date}}</span>'},
        {field: 'plat_times', displayName: '播放量', cellTemplate: '<span style="margin-left:10px">{{row.entity.plat_times}}</span>'},
        {field: 'total', displayName: '评论数', cellTemplate: '<span style="margin-left:10px">{{row.entity.total}}</span>'},
    ];

    $scope.gridOptions = {
        data: 'myData',
        columnDefs: $scope.columnDefs,
        enablePaging: true,
        showFooter: true,
        pagingOptions: $scope.pagingOptions,
        filterOptions: $scope.filterOptions,
    };
}]);