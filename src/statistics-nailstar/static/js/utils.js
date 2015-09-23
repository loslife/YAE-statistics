angular.module('app.utilsService', [])
    .factory('utilsService', function(){

        var service = {};

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

        service.formatDataByOrderAndNum = function(details, order, num){
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
        };

        service.formatDataByNoX = function _formatDataX(details){
            return _.map(details, function(el){
                return el.title;
            }).reverse();
        };

        service.formatDataByNoY = function _formatDataX(details){
            return _.map(details, function(el){
                return el.count;
            }).reverse();
        };

        return service;
});