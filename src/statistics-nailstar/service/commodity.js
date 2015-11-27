var dbHelper = require(FRAMEWORKPATH + "/utils/dbHelper");

exports.commodityTopicCount = commodityTopicCount;
exports.commodityShopCount = commodityShopCount;

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