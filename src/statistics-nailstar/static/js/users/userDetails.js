app.controller('userDetailsCtrl', ['$rootScope', '$scope', '$http', '$stateParams', function ($rootScope, $scope, $http, $stateParams) {

    if($stateParams.id && $stateParams.username && $stateParams.nickname){
        $scope.initialValue = {
            id: $stateParams.id,
            username: $stateParams.username,
            nickname: $stateParams.nickname
        };
    }

    $scope.remoteUrlRequestFn = function(str) {
        return {param: str};
    };

    var id;
    $scope.userSelected = function(user){

        id = user.originalObject.id;
        $http.get("/svc/dakatongji/findUserDetails?id=" + id).success(function (data) {

            $scope.infos = data.result;

            var status = ['', '美甲店主', '美甲师', '美甲从业者', '美甲消费者', '美甲老师', '其他'];
            var sex = ['其他', '女', '男'];

            $scope.infos.userType = status[$scope.infos.type];

            $scope.infos.userGender = sex[$scope.infos.gender];

        }).error(function (data, status) {

            console.log("userDetails in error");

        });

		$scope.getPagedDataAsync(id, $scope.pagingOptions.pageSize, $scope.pagingOptions.currentPage);
        $scope.getPageDataCountAsync(id);

		$scope.getPagedDataAsyncHomework(id, $scope.pagingOptionsHomework.pageSize, $scope.pagingOptionsHomework.currentPage);
        $scope.getPageDataCountAsyncHomework(id);

    };

    //用户评论分页查询

	$scope.filterOptions = {
		filterText: "",
		useExternalFilter: true
	};
	$scope.totalServerItems = 0;
	$scope.pagingOptions = {
		pageSizes: [10, 20, 50],
		pageSize: 10,
		currentPage: 1
	};
	$scope.setPagingData = function(data){
		console.log(data);
		$scope.myData = data;
		if (!$scope.$$phase) {
			$scope.$apply();
		}
	};
	$scope.getPagedDataAsync = function (id, pageSize, page) {
		$http.get('/svc/dakatongji/findUserCommentDetails?id=' + id + "&page=" + page + "&perpage=" + pageSize, {}).success(function (data) {
			$scope.setPagingData(data.result);
		});
	};

    $scope.getPageDataCountAsync = function (id) {
        var url = "/svc/dakatongji/findUserCommentDetailsCount?id=" + id;
        $http.get(url).success(function(data){
            if(data.code == 0){
                $scope.totalServerItems = data.result.count;
            }
        });
    };

	$scope.$watch('pagingOptions', function (newVal, oldVal) {
		if (newVal !== oldVal && newVal.currentPage !== oldVal.currentPage) {
			$scope.getPagedDataAsync(id, $scope.pagingOptions.pageSize, $scope.pagingOptions.currentPage);
		}
	}, true);
	$scope.$watch('filterOptions', function (newVal, oldVal) {
		if (newVal !== oldVal) {
			$scope.getPagedDataAsync(id, $scope.pagingOptions.pageSize, $scope.pagingOptions.currentPage);
		}
	}, true);
	$scope.columnDefs = [
		{field: 'title', headerCellClass: 'blue', displayName: '标题', cellTemplate: "<span>{{row.entity.title}}</span>"},
		{field: 'content', displayName: '内容', cellTemplate: "<span>{{row.entity.content}}</span>"},
		{field: 'create_date', displayName: '创建时间', cellTemplate: '<span>{{row.entity.create_date|date:"yyyy-MM-dd hh:mm"}}</span>'},
	];

	$scope.myData = [];
	$scope.gridOptions = {
		data: 'myData',
		columnDefs: $scope.columnDefs,
		enablePaging: true,
		showFooter: true,
        enableSorting: true,
		rowHeight:60,
		pagingOptions: $scope.pagingOptions,
		filterOptions: $scope.filterOptions,
        totalServerItems: 'totalServerItems',
		multiSelect: false,
		i18n: 'zh_cn'
	};
	window.ngGrid.i18n['zh_cn'] = yilos_i18n.resource;

    //交作业分页查询

    $scope.filterOptionsHomework = {
        filterText: "",
        useExternalFilter: true
    };
    $scope.totalServerItemsHomework = 0;
    $scope.pagingOptionsHomework = {
        pageSizes: [10, 20, 50],
        pageSize: 10,
        currentPage: 1
    };
    $scope.setPagingDataHomework = function(data){
        console.log(data);
        $scope.myDataHomework = data;
        if (!$scope.$$phase) {
            $scope.$apply();
        }
    };
    $scope.getPagedDataAsyncHomework = function (id, pageSize, page) {
        $http.get('/svc/dakatongji/findUserHomeworkDetails?id=' + id + "&page=" + page + "&perpage=" + pageSize, {}).success(function (data) {
            $scope.setPagingDataHomework(data.result);
        });
    };

    $scope.getPageDataCountAsyncHomework = function (id) {
        var url = "/svc/dakatongji/findUserHomeworkDetailsCount?id=" + id;
        $http.get(url).success(function(data){
            if(data.code == 0){
                $scope.totalServerItemsHomework = data.result.count;
            }
        });
    };

    $scope.$watch('pagingOptionsHomework', function (newVal, oldVal) {
        if (newVal !== oldVal && newVal.currentPage !== oldVal.currentPage) {
            $scope.getPagedDataAsyncHomework(id, $scope.pagingOptionsHomework.pageSize, $scope.pagingOptionsHomework.currentPage);
        }
    }, true);
    $scope.$watch('filterOptionsHomework', function (newVal, oldVal) {
        if (newVal !== oldVal) {
            $scope.getPagedDataAsyncHomework(id, $scope.pagingOptionsHomework.pageSize, $scope.pagingOptionsHomework.currentPage);
        }
    }, true);
    $scope.columnDefsHomework = [
        {field: 'title', displayName: '标题', cellTemplate: "<span>{{row.entity.title}}</span>"},
        {field: 'content', displayName: '内容', cellTemplate: "<span>{{row.entity.content}}</span>"},
        {field: 'pic', displayName: '图片', cellTemplate: '<div style="width: 110px;margin: 0 auto;"><img style="width: 53%;margin-left:10px;" src="{{row.entity.pic}}" /></div>'},
        {field: 'create_date', displayName: '创建时间', cellTemplate: '<span>{{row.entity.create_date|date:"yyyy-MM-dd hh:mm"}}</span>'},
    ];

    $scope.myDataHomework = [];
    $scope.gridOptionsHomework = {
        data: 'myDataHomework',
        columnDefs: $scope.columnDefsHomework,
        enablePaging: true,
        showFooter: true,
        rowHeight:60,
        pagingOptions: $scope.pagingOptionsHomework,
        filterOptions: $scope.filterOptionsHomework,
        totalServerItems: 'totalServerItemsHomework',
        multiSelect: false,
        i18n: 'zh_cn'
    };

}]);