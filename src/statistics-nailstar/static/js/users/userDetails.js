app.controller('userDetailsCtrl', ['$rootScope', '$scope', '$http', '$stateParams', function ($rootScope, $scope, $http, $stateParams) {

    if($stateParams.id && $stateParams.username && $stateParams.nickname){
        $scope.initialValue = {
            id: $stateParams.id,
            username: $stateParams.username,
            nickname: $stateParams.nickname
        };
    }

    $scope.remoteUrlRequestFn = function(str) {
        return {nickname: str};
    };

    $scope.userSelected = function(user){

        $http.get("/svc/dakatongji/findUserDetails?id=" + user.originalObject.id).success(function (data) {

            $scope.infos = data.result;

            if($scope.infos.birthday){
                $scope.infos.userBirthdaty = moment($scope.infos.birthday).format("YYYY-MM-DD");//出生日期
            }

            if($scope.infos.creat_date){
                $scope.infos.UserCreatedate = moment($scope.infos.creat_date).format("YYYY-MM-DD");//创建时间
            }

            var status = ['', '美甲店主', '美甲师', '美甲从业者', '美甲消费者', '美甲老师', '其他'];
            var sex = ['其他', '女', '男'];

            $scope.infos.userType = status[$scope.infos.type];

            $scope.infos.userGender = sex[$scope.infos.gender];

        }).error(function (data, status) {

            console.log("userDetails in error");

        });

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
		    $http.get('/svc/dakatongji/findUserCommentDetails?id=' + user.originalObject.id + "&page=" + page + "&perpage=" + pageSize, {}).success(function (data) {
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
		    {field: 'title', displayName: '标题', cellTemplate: "<span>{{row.entity.title}}</span>"},
		    {field: 'content', displayName: '内容', cellTemplate: "<span>{{row.entity.content}}</span>"},
		    {field: 'create_date', displayName: '创建时间', cellTemplate: '<span>{{row.entity.create_date}}</span>'},
	    ];

        $scope.myData = [];
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

    };



}]);