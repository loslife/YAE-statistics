var dbHelper = require(FRAMEWORKPATH + "/utils/dbHelper");

exports.commodityTopicCount = commodityTopicCount;
exports.commodityShopCount = commodityShopCount;
exports.commodityStayTime = commodityStayTime;

//视频中商品点击数
function commodityTopicCount(req, res, next){

    var sql = "select name 'title',click_from_topic 'value' from commodities order by click_from_topic desc";

    dbHelper.execSql(sql, {}, function(err, result){
        if(err){
            return next(err);
        }
        doResponse(req, res, result);
    });
}

//视频中商品点击数
function commodityShopCount(req, res, next){

    var sql = "select name 'title',click_from_shop 'value' from commodities order by click_from_shop desc";

    dbHelper.execSql(sql, {}, function(err, result){
        if(err){
            return next(err);
        }
        doResponse(req, res, result);
    });
}

//商城平均停留时长
function commodityStayTime(req, res, next){

    var num = (parseInt(req.query["num"]) || 10) - 1;

    var sql = "select ROUND(avg(leave_date - enter_date)/1000,1) 'count',from_unixtime(enter_date/1000, '%Y%m%d') 'time' from page_history " +
        "where page = 'ShoppingMallViewController' and from_unixtime(enter_date/1000, '%Y%m%d') " +
        "between date_format(date_add(now(), interval -" + num + " day), '%Y%m%d') and date_format(now(), '%Y%m%d') " +
        "group by time order by time desc";

    dbHelper.execSql(sql, {}, function(err, result){
        if(err){
            return next(err);
        }
        doResponse(req, res, result);
    });

}