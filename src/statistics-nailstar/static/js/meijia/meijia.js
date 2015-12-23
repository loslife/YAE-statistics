app.controller('meijiaCtrl', ['$rootScope', '$scope', '$http', 'utilsService','$location','$stateParams','$state', function ($rootScope, $scope, $http,utilsService,$location, $stateParams,$state) {

    //初始化数据
    $scope.initData = {
        cates:'',
        type:0,         //0按类别，1按关键词，2按时间
        posts:'',
        show:{
            key:'',
            cate_id:'',
            imgs:'',
            num:1
        },
        add:{
            community_id:'',
            nickname:'',
            creator_id:'',
            title:'',
            is_hot:0,
            is_top:0,
            content:'',
            imgs:[]
        }
    }

    //表格数据初始化
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

    //获取美甲分类列表
    function getCates () {

        var url = "/svc/dakatongji/meijia/getCates";
        $http.get(url).success(function (data) {
            $scope.initData.cates = data.result.cates;
            $scope.initData.show.cate_id = $scope.initData.cates[0].cate_id;

            getPosterWithCate($scope.initData.show.cate_id,$scope.pagingOptions.currentPage,20);
        });
    }
    getCates ();

    //选择类别
    $scope.selectCate = function (data) {
        if(!data){
            alert("请选择一个有效类别！");
            return;
        }

        $scope.pagingOptions.currentPage = 1;
        $scope.pagingOptions.pageSize = 20;
        getPosterWithCate(data,1,20);
    }

    //根据类别id获取帖子
    function getPosterWithCate (cate_id, page, perPage) {

        var url = "/svc/dakatongji/meijia/getPostsWithCate?cate_id="+cate_id+"&page="+page+"&perPage="+perPage;
        $http.get(url).success(function (data) {
            $scope.initData.type = 0;
            $scope.setPagingData(data.result.pageData);
            $scope.totalServerItems = data.result.count;
        });
    }

    //根据关键词获取帖子
    $scope.gosearch = function (key,page,perPage) {
        var url = "/svc/dakatongji/meijia/getPostsWithKey?key="+key+"&page="+page+"&perPage="+perPage;
        $http.get(url).success(function (data) {
            $scope.initData.type = 1;
            $scope.initData.show.cate_id = '';
            $scope.pagingOptions.currentPage = page;
            $scope.pagingOptions.pageSize = perPage;

            $scope.setPagingData(data.result.pageData);
            $scope.totalServerItems = data.result.count;
        });
    }

    //根据日期搜索帖子
    $scope.getsearchDate = function (page,perPage) {
        var start_date = Math.round($scope.sdt);
        var end_date   = Math.round($scope.edt);

        if(start_date >= end_date){
            alert("截止日期错误！");
            return;
        }
        var url = "/svc/dakatongji/meijia/getPostsWithDate?start_date="+start_date+"&end_date="+end_date+"&page="+page+"&perPage="+perPage;
        $http.get(url).success(function (data) {
            $scope.initData.type = 2;
            $scope.initData.show.cate_id = '';
            $scope.pagingOptions.currentPage = page;
            $scope.pagingOptions.pageSize = perPage;

            $scope.setPagingData(data.result.pageData);
            $scope.totalServerItems = data.result.count;
        });

    }

    //创建表格
    $scope.setPagingData = function(data){
        $scope.myData = data;
        if (!$scope.$$phase) {
            $scope.$apply();
        }
    };

    //待创建表单
    $scope.$watch('pagingOptions', function (newVal, oldVal) {
        if (newVal !== oldVal && (newVal.currentPage !== oldVal.currentPage || newVal.pageSize !== oldVal.pageSize)) {
            if($scope.initData.type == 0){
                getPosterWithCate($scope.initData.show.cate_id,$scope.pagingOptions.currentPage, $scope.pagingOptions.pageSize);
            }else if($scope.initData.type == 1){
                $scope.gosearch($scope.initData.show.key,$scope.pagingOptions.currentPage,$scope.pagingOptions.pageSize);
            }else{
                $scope.getsearchDate($scope.pagingOptions.currentPage,$scope.pagingOptions.pageSize);
            }
            
        }
    }, true);
    $scope.$watch('filterOptions', function (newVal, oldVal) {
        if (newVal !== oldVal) {
            if($scope.initData.type == 0){
                getPosterWithCate($scope.initData.show.cate_id,$scope.pagingOptions.currentPage, $scope.pagingOptions.pageSize);
            }else if($scope.initData.type == 1){
                $scope.gosearch($scope.initData.show.key,$scope.pagingOptions.currentPage,$scope.pagingOptions.pageSize);
            }else{
                $scope.getsearchDate($scope.pagingOptions.currentPage,$scope.pagingOptions.pageSize);
            }
        }
    }, true);

    $scope.columnDefs = [
        {filed: 'cate_name', displayName: '类别', cellTemplate: '<span>{{row.entity.cate_name}}</span>'},
        {field: 'title', displayName: '标题', cellTemplate: '<span>{{row.entity.title}}</span>'},
        {field: 'content', displayName: '描述', cellTemplate: '<span>{{row.entity.content}}</span>'},
        {field: 'nickname', displayName: '作者',cellTemplate: '<span>{{row.entity.nickname}}</span>'},
        {field: 'create_time', displayName: '时间',cellTemplate: '<span>{{row.entity.create_time |date:"yyyy-MM-dd hh:mm"}}</span>'},
        {field: '', displayName: '操作', cellTemplate: '<span class="label bg-success" data-toggle="modal" data-target=".editPost" ng-click="editPost(row.entity)">转发帖子</span>'}
    ];
    $scope.gridOptions = {
        data: 'myData',
        columnDefs: $scope.columnDefs,
        enablePaging: true,
        showFooter: true,
        totalServerItems: 'totalServerItems',
        pagingOptions: $scope.pagingOptions,
        filterOptions: $scope.filterOptions,
        multiSelect: false,
        rowHeight:80,
        i18n: 'zh_cn'
    };
    window.ngGrid.i18n['zh_cn'] = yilos_i18n.resource;

    //点击转载按钮
    $scope.editPost = function (post) {
        $scope.initData.add.content = post.content;
        $scope.initData.add.title   = post.content;

        //初始化其他数据
        $scope.initData.add.community_id = '';
        $scope.initData.add.creator_id = '';
        $scope.initData.add.is_hot = '';
        $scope.initData.add.is_top = '';
        $scope.initData.add.imgs = [];
        $scope.initData.show.num = 1;

        var url = "/svc/dakatongji/meijia/postImg/"+post.post_id;
        $http.get(url).success(function (data) {
            $scope.initData.show.imgs = data.result.images;
        });
    }
   
    //搜索圈子传参数
    $scope.remoteUrlRequestFnC = function(str) {
        return {key: str};
    };

    // 选择圈子
    $scope.addCommunity = function (data) {
        $scope.initData.add.community_id = data.originalObject.community_id;
    }

    //搜索作者传参数
    $scope.remoteUrlRequestFn = function(str) {
        return {param: str};
    };

    // 选择作者
    $scope.addAuthor = function (data) {
        $scope.initData.add.creator_id = data.originalObject.id;
    }

    //转载帖子top开关
    $scope.chooseTop = function () {
        if($scope.initData.add.is_top != 0){
            $scope.initData.add.is_top = 0;
            return;
        }
           $scope.initData.add.is_top = 1; 
    }

    //转载帖子hot开关
    $scope.chooseHot = function () {
        if($scope.initData.add.is_hot != 0){
            $scope.initData.add.is_hot = 0;
            return;
        }
           $scope.initData.add.is_hot = 1; 
    }

    //点击新建确定按钮
    $scope.addPostOk = function () {
        var url          = "/svc/dakatongji/meijia/addPost";
        var creator_id   = $scope.initData.add.creator_id;
        var community_id = $scope.initData.add.community_id;
        var title        = $scope.initData.add.title;
        var content      = $scope.initData.add.content;
        var is_hot       = $scope.initData.add.is_hot;
        var is_top       = $scope.initData.add.is_top;
        var imgs         = $scope.initData.add.imgs;
        if( creator_id && title && content){
            $http.post(url,{community_id: community_id, title: title, content: content, is_hot: is_hot, is_top: is_top, imgs: imgs, creator_id: creator_id}).success(function (data) {
                alert("转载成功！");
                $(".editPost").modal('hide');
            });
            return;
        }
        alert("请将信息填写完整");
    }

    //上传图片
    $scope.addinitUploadWidget = function(){
        $('#fileupload').fileupload({
            url: '/svc/picture/upload',
            prependFiles:"html",
            getFilesFromResponse:getThumb_pic_urlFromResponse,
            acceptFileTypes: /(\.|\/)(jpg|png)$/i,
            formData:function () {
                return [];
            }
        }).bind('fileuploadfinished',function(e,data){
                $(".uplpadimg").hide();
            })
            .addClass('fileupload-processing');

        function getThumb_pic_urlFromResponse(data){
            var img = {
                id:'',
                pic_url:data.result.result.files[0].url,
                serial_number:$scope.initData.show.num
            };

            $scope.initData.add.imgs.push(img);
            $scope.initData.show.num++;
            $scope.digestScope();
            return data.result.result.files;
        }       
    };
    $scope.addinitUploadWidget();

    $scope.digestScope = function () {
        setTimeout(function() {
            try {
                $scope.$digest();
            }
            catch(e) {
                console.log(e);
            }
        });
    };



}]);