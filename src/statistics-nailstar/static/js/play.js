app.controller('dakaPlayCtrl', ['$rootScope', '$scope', '$http', function ($rootScope, $scope, $http) {

    (function init(){
        initCates();
        initNo();
    })();

    function initCates(){
        //默认参数
        $scope.CateParams = {
            cateId: null,//初始分类id
            order: "0",//初始维度
            num: 10,//初始数据数量
            refresh: null,
            showSpline: true
        };
        $scope.cate_result = [];

        //监听参数变化
        $scope.$watch('CateParams', function(newVal, oldVal){
            if (newVal && (newVal !== oldVal) &&
                (newVal.cateId !== oldVal.cateId || newVal.order !== oldVal.order || newVal.num !== oldVal.num)) {
                if(newVal.cateId){
                    getCatePlayData(newVal.cateId, newVal.order, newVal.num);
                }
            }
            if((newVal !== oldVal) && newVal && newVal.showSpline !== oldVal.showSpline){
                resetRefresh();
            }
        }, true);

        //数据缓存
        var playDataCache = {};
        //获取播放数据
        function getCatePlayData(id, order, num){
            if(playDataCache[id + "_" + order]){
                $scope.cate_result = playDataCache[id + "_" + order];
                resetRefresh();
                return;
            }
            var url = "/svc/dakatongji/getplayByCate?cate=" + id + "&order=" + order + "&num=" + num;
            $http.get(url).success(function(data) {
                var rs = _formatData(data.result.details, order, num);
                playDataCache[id + "_" + order] = rs;
                //console.log(rs);
                $scope.cate_result = rs;
                resetRefresh();
            }).error(function(data, status) {
                console.log("getplayByCate in error");
            });
        }

        //数据格式化
        function _formatData(details, order, num){
            switch(order){
                case "0" :
                    return _formatDataByDay();
                case "1" :
                    return _formatDataByWeek();
                case "2" :
                    return _formatDataByMonth();
                default :
                    return _formatDataByDay();
            }

            function _formatDataByDay(){
                for(var i=0; i<num; i++){
                    var day = moment().add(-i, 'd').format("YYYYMMDD");
                    var flag = true;
                    for(var j=0; j<details.length; j++){
                        var detail = details[j];
                        if(detail.day === day){
                            flag = false;
                            break;
                        }
                    }
                    if(flag){
                        details.splice(i, 0, {day: day,count: 0});
                    }
                }
                return _.map(details, function(el){
                    return [moment(el.day, 'YYYYMMDD').valueOf(), el.count];
                });
            }
            function _formatDataByWeek(){
                for(var i=0; i<num; i++){
                    var week = moment().add(-i, 'w').format("YYYY") + moment().add(-i, 'w').week();
                    var flag = true;
                    for(var j=0; j<details.length; j++){
                        var detail = details[j];
                        if(detail.week === week){
                            flag = false;
                            break;
                        }
                    }
                    if(flag){
                        details.splice(i, 0, {week: week,count: 0});
                    }
                }
                return _.map(details, function(el){
                    return [moment(el.week, 'YYYYww').valueOf(), el.count];
                });
            }
            function _formatDataByMonth(){
                for(var i=0; i<num; i++){
                    var month = moment().add(-i, 'M').format("YYYYMM");
                    var flag = true;
                    for(var j=0; j<details.length; j++){
                        var detail = details[j];
                        if(detail.month === month){
                            flag = false;
                            break;
                        }
                    }
                    if(flag){
                        details.splice(i, 0, {month: month,count: 0});
                    }
                }
                return _.map(details, function(el){
                    return [moment(el.month, 'YYYYMM').valueOf(), el.count];
                });
            }
        }

        $scope.kind = { isopen: false };
        $scope.selectKind = '请选择一个分类';

        //获取分类数据
        function getCates(){
            var url = "/svc/dakatongji/getCategories";
            $http.get(url).success(function(data) {
                $scope.cates = data.result.cates;
            }).error(function(data, status) {
                console.log("getCategories in error");
            });
        }

        //修改分类数据
        $scope.changeCate = function(id,name){
            $scope.CateParams.cateId = id;
            $scope.selectKind = name;
            $scope.kind.isopen = !$scope.kind.isopen;
        };

        function resetRefresh(){
            $scope.CateParams.refresh = Math.random();
        }

        $scope.myTickFormatter = function(val, axis){
            switch($scope.CateParams.order){
                case "0" :
                    return moment(val).format("YYYYMMDD");
                case "1" :
                    return moment(val).format("YYYY") + "第" + moment(val).week() + "周";
                case "2" :
                    return moment(val).format("YYYYMM");
                default :
                    return moment(val).format("YYYYMMDD");
            }
        };

        getCates();
    }

    function initNo(){
        //默认参数
        $scope.noParams = {
            num: 10,//初始数据数量
            refresh: null,
            showSpline: true,
            changeNum: function(){
                getNoPlayData($scope.noParams.num);
            }
        };
        $scope.no_result = [];

        //监听参数变化
        $scope.$watch('noParams', function(newVal, oldVal){
            //if (newVal && (newVal !== oldVal) && (newVal.num !== oldVal.num)) {
            //    getNoPlayData(newVal.num);
            //}
            if((newVal !== oldVal) && newVal && newVal.showSpline !== oldVal.showSpline){
                resetRefresh();
            }
        }, true);

        var playDataCache = {};
        //获取播放数据
        function getNoPlayData(num){
            if(playDataCache[num]){
                $scope.no_result = playDataCache[num];
                resetRefresh();
                return;
            }
            var url = "/svc/dakatongji/getplayByNo?num=" + num;
            $http.get(url).success(function(data) {
                var rs = _formatData(data.result.details);
                console.log(rs);
                playDataCache[num] = rs;
                $scope.no_result = rs;
                resetRefresh();
            }).error(function(data, status) {
                console.log("getplayByCate in error");
            });
        }

        function _formatData(details){
            return _.map(details, function(el){
                return [el.title, el.count];
            }).reverse();
        }

        function resetRefresh(){
            $scope.noParams.refresh = Math.random();
        }

        getNoPlayData($scope.noParams.num);
    }

}]);