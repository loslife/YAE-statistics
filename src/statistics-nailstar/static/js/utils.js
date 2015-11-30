angular.module('app.utilsService', [])
    .factory('utilsService', function(){

        var service = {};

        //获取格式化后的数据
        service.getFormatData = function (result, param) {
            return _.map(result, function(el){
                return el[param];
            }).reverse();
        };

        //格式化最新活动期数的数据
        service.formatDataByNo = function(details, no, num){

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

        };

        //格式化视频系列播放统计数据
        service.formatDataByOrderAndNum = function(details, order, num, params){
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
                        if(detail.time === day){
                            flag = false;
                            break;
                        }
                    }
                    if(flag){
                        var result = {time: day};
                        for(param in params){
                            result[params[param]] = 0;
                        }
                        details.splice(i, 0, result);
                    }
                }
            }

            function _formatDataByWeekX(){
                for(var i=0; i<num; i++){
                    var week = moment().add(-i, 'w').format("YYYY") + moment().add(-i, 'w').week();
                    var flag = true;
                    for(var j=0; j<details.length; j++){
                        var detail = details[j];
                        if(detail.time === week){
                            flag = false;
                            break;
                        }
                    }
                    if(flag){
                        var result = {time: week};
                        for(param in params){
                            result[params[param]] = 0;
                        }
                        details.splice(i, 0, result);
                    }
                }
            }

            function _formatDataByMonthX(){
                for(var i=0; i<num; i++){
                    var month = moment().add(-i, 'M').format("YYYYMM");
                    var flag = true;
                    for(var j=0; j<details.length; j++){
                        var detail = details[j];
                        if(detail.time === month){
                            flag = false;
                            break;
                        }
                    }
                    if(flag){
                        var result = {time: month};
                        for(param in params){
                            result[params[param]] = 0;
                        }
                        details.splice(i, 0, result);
                    }
                }
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
                            return moment(val, "YYYYMMDD").format("YYYYMMDD");
                        };
                    case "1" :
                        return function(val){
                            return moment(val, "YYYYww").year() + "第" + moment(val, "YYYYww").week() + "周"
                        };
                    case "2" :
                        return function(val){
                            return moment(val, "YYYYMM").format("YYYYMM")
                        };
                    default :
                        return function(val){
                            return moment(val, "YYYYMMDD").format("YYYYMMDD")
                        };
                }
            }

            return array;
        };

        return service;
});