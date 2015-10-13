angular.module('app.utilsService', [])
    .factory('utilsService', function(){

        var service = {};

        //获取最新活动期数的数据格式化
        service.formatDataX = function(details, no, num){
            var length = details.length;
            if(num == length){
                return _.map(details, function(el){
                    return el.no;
                }).reverse();
            }
            for(var i=0; i<num; i++){
                var flag = true;
                for(var j=0; j<details.length; j++){
                    var detail = details[j];
                    if(detail.no === (no - i)){
                        flag = false;
                        break;
                    }
                }
                if(flag){
                    details.splice(i, 0, {no: no - i,count: 0});
                }
            }
            return _.map(details, function(el){
                return el.no;
            }).reverse();
        };

        service.formatDataY = function(details, no, num){
            var length = details.length;
            if(num == length){
                return _.map(details, function(el){
                    return el.count;
                }).reverse();
            }
            for(var i=0; i<num; i++){
                var flag = true;
                for(var j=0; j<details.length; j++){
                    var detail = details[j];
                    if(detail.no === (no - i)){
                        flag = false;
                        break;
                    }
                }
                if(flag){
                    details.splice(i, 0, {no: no - i,count: 0});
                }
            }
            return _.map(details, function(el){
                return el.count;
            }).reverse();
        };

        service.formatRankX = function (result){
            return _.map(result, function(el){
                return el.nickname;
            }).reverse();
        };

        service.formatRankY = function (result){
            return _.map(result, function(el){
                return el.count;
            }).reverse();
        };

        //视频分期播放统计数据格式化
        service.formatDataByNoX = function _formatDataX(details){
            return _.map(details, function(el){
                return el.title;
            }).reverse();
        };

        service.formatDataByNoY = function _formatDataY(details){
            return _.map(details, function(el){
                return el.count;
            }).reverse();
        };

        //视频系列播放统计数据格式化
        service.formatDataByOrderAndNumX = function(details, order, num){
            switch(order){
                case "0" :
                    return _formatDataByDayX();
                case "1" :
                    return _formatDataByWeekX();
                case "2" :
                    return _formatDataByMonthX();
                default :
                    return _formatDataByDayX();
            }

            function _formatDataByDayX(){
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
                    return moment(el.day, 'YYYYMMDD').valueOf();
                }).reverse();
            }

            function _formatDataByWeekX(){
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
                    return moment(el.week, 'YYYYww').valueOf();
                }).reverse();
            }

            function _formatDataByMonthX(){
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
                    return moment(el.month, 'YYYYMM').valueOf();
                }).reverse();
            }
        };

        service.formatDataByOrderAndNumY = function(details, order, num, param){
            switch(order){
                case "0" :
                    return _formatDataByDayY();
                case "1" :
                    return _formatDataByWeekY();
                case "2" :
                    return _formatDataByMonthY();
                default :
                    return _formatDataByDayY();
            }

            //Y轴不需要对day进行补全
            function _formatDataByDayY(){
                return _.map(details, function(el){
                    return el[param];
                }).reverse();
            }

            function _formatDataByWeekY(){
                return _.map(details, function(el){
                    return el[param];
                }).reverse();
            }

            function _formatDataByMonthY(){
                return _.map(details, function(el){
                    return el[param];
                }).reverse();
            }
        };

        //维度的数据格式化
        service.tickFormatter = function (rs, order){
            var array = [];
            var formatFunction = getFormatFunction();
            for(var i = 0; i < rs.length; i++){
                array.push(formatFunction(rs[i]));
            }

            function getFormatFunction(){
                switch(order){
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
        };

        return service;
});