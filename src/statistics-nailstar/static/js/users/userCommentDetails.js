app.controller('usercommentdetails', ['$rootScope', '$scope', '$http', function($rootScope, $scope, $http) {

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
        $http.get('/svc/dakatongji/findUserCommentDetails', {}).success(function (data) {
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
        //{field: 'name', displayName: '图片', cellTemplate: '<div style="width: 110px;margin: 0 auto;"><img style="width: 100%;margin-left:10px;" src="{{row.entity.picUrl}}" /></div>'},
        {field: 'username', displayName: '用户名', cellTemplate: "<span>{{row.entity.username}}</span>"},
        {field: 'nickname', displayName: '昵称', cellTemplate: "<span>{{row.entity.nickname}}</span>"},
        {field: 'type', displayName: '身份', cellTemplate: "<span>{{row.entity.type}}</span>"},
        {field: 'gender', displayName: '性别', cellTemplate: "<span>{{row.entity.gender}}</span>"},
        {field: 'birthday', displayName: '出生日期', cellTemplate: "<span>{{row.entity.birthday}}</span>"},
        {field: 'location', displayName: '地址', cellTemplate: "<span>{{row.entity.location}}</span>"},
        {field: 'create_date', displayName: '创建日期', cellTemplate: '<span>{{row.entity.create_date}}</span>'},
        {field: 'exp', displayName: '经验值', cellTemplate: '<span>{{row.entity.exp}}</span>'},
        {field: 'coin', displayName: '咖币数', cellTemplate: '<span>{{row.entity.coin}}</span>'},
    ];

    $scope.gridOptions = {
        data: 'myData',
        columnDefs: $scope.columnDefs,
        enablePaging: true,
        showFooter: true,
        rowHeight:60,
        pagingOptions: $scope.pagingOptions,
        filterOptions: $scope.filterOptions,
        multiSelect: false,
        i18n: 'zh_cn'
    };
    window.ngGrid.i18n['zh_cn'] = yilos_i18n.resource;
}]);