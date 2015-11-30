var _ = require("underscore");
var async = require("async");
var dbHelper = require(FRAMEWORKPATH + "/utils/dbHelper");

exports.indexRollTimes = indexRollTimes;

//首页滚屏次数
function indexRollTimes(req, res, next){

    var num = (parseInt(req.query["num"]) || 10) - 1;

    var sql = "select count(id) 'count',from_unixtime(create_date/1000, '%Y%m%d') 'time' from event_logs " +
        "where event_id = 14 and from_unixtime(create_date/1000, '%Y%m%d') " +
        "between date_format(date_add(now(), interval -" + num + " day), '%Y%m%d') and date_format(now(), '%Y%m%d') " +
        "group by time order by time desc";

    dbHelper.execSql(sql, {}, function(err, result){
        if(err){
            return next(err);
        }
        doResponse(req, res, result);
    });

}