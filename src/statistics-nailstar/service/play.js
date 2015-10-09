var _ = require("underscore");
var async = require("async");
var dbHelper = require(FRAMEWORKPATH + "/utils/dbHelper");

exports.getCategories = getCategories;
exports.getplayByCate = getplayByCate;
exports.getplayByNo = getplayByNo;

//获取⾸⻚列表接口
function getCategories(req, res, next) {

    var sql = "select id,name from topic_categories order by serial_number";

    dbHelper.execSql(sql, {}, function (err, data) {
        if (err) {
            return next(err);
        }
        doResponse(req, res, {cates: data});
    });

}

//美甲大咖系列播放数
function getplayByCate(req, res, next) {

    var cate = req.query["cate"];
    if(!cate){
        next("缺失参数cate");
    }

    var order = req.query["order"] || 0;
    var num = parseInt(req.query["num"]) || 10;

    var sqls = getSqlsByOrder(order, num);

    var obj = {
        totalCount: 0,
        details: []
    };

    async.parallel([_queryTotal, _queryDetails], function (err) {
        if(err){
            return next(err);
        }
        doResponse(req, res, obj);
    });

    function _queryTotal(nextStep){
        dbHelper.execSql(sqls[0], {cate: cate}, function (err, rows) {

            if (err) {
                console.log(err);
                nextStep(err);
                return;
            }
            obj.totalCount = rows[0].total;
            nextStep();
        });
    }
    function _queryDetails(nextStep){
        dbHelper.execSql(sqls[1], {cate: cate}, function (err, rows) {

            if (err) {
                console.log(err);
                nextStep(err);
                return;
            }

            obj.details = rows;
            nextStep();
        });
    }
}

//美甲大咖分期播放数
function getplayByNo(req, res, next){

    var num = parseInt(req.query["num"]) || 10;

    var sql1 = "select sum(count) 'count' from (select count(b.id) 'count' " +
        "from topics a left join topic_actions b on a.id = b.topic_id and b.action_type = 1 " +
        "group by a.id order by a.create_date desc limit 0,:num) a";
    var sql2 = "select a.title 'title',count(b.id) 'count' " +
        "from topics a left join topic_actions b on a.id = b.topic_id and b.action_type = 1 " +
        "group by a.id order by a.create_date desc limit 0,:num";

    var obj = {
        totalCount: 0,
        details: []
    };

    async.parallel([_queryTotal, _queryPlayByNo], function(err, result){
        if(err){
            return next(err);
        }
        doResponse(req, res, obj);
    });

    function _queryTotal(nextStep){
        dbHelper.execSql(sql1, {num: num}, function (err, data) {
            if (err) {
                return nextStep(err);
            }
            obj.totalCount = data[0].count;
            nextStep();
        });
    }
    function _queryPlayByNo(nextStep){
        dbHelper.execSql(sql2, {num: num}, function (err, data) {
            if (err) {
                return nextStep(err);
            }
            obj.details = data;
            nextStep();
        });
    }
}

//内部函数：根据参数获取对应sql
function getSqlsByOrder(order, num){

    var sql_total_by_day = "select count(1) as total " +
        "from topic_actions a join categories_has_topics b on a.topic_id = b.topic_id " +
        "where a.action_type = 1 and b.category_id = :cate and FROM_UNIXTIME( a.create_date/1000, '%Y%m%d') " +
        "between date_format(date_add(now(), interval -" + num + " day), '%Y%m%d') and date_format(now(), '%Y%m%d') ";

    var sql_total_by_week = "select count(1) as total " +
        "from topic_actions a join categories_has_topics b on a.topic_id = b.topic_id " +
        "where a.action_type = 1 and b.category_id = :cate and FROM_UNIXTIME( a.create_date/1000, '%Y%u' ) " +
        "between date_format(date_add(now(), interval -" + num + " week), '%Y%u') and date_format(now(), '%Y%u') ";

    var sql_total_by_month = "select count(1) as total " +
        "from topic_actions a join categories_has_topics b on a.topic_id = b.topic_id " +
        "where a.action_type = 1 and b.category_id = :cate and FROM_UNIXTIME( a.create_date/1000, '%Y%m' ) " +
        "between date_format(date_add(now(), interval -" + num + " month), '%Y%m') and date_format(now(), '%Y%m') ";

    var sql_order_by_day = "select from_unixtime(a.create_date/1000, '%Y%m%d') as 'day', count(a.id) as 'count' " +
        "from topic_actions a join categories_has_topics b on a.topic_id = b.topic_id " +
        "where a.action_type = 1 and b.category_id = :cate " +
        "and FROM_UNIXTIME( a.create_date/1000, '%Y%m%d' ) " +
        "between date_format(date_add(now(), interval -" + num + " day), '%Y%m%d') and date_format(now(), '%Y%m%d') " +
        "group by day order by day desc";

    var sql_order_by_week = "select from_unixtime(a.create_date/1000, '%Y%u') as 'week', count(a.id) as 'count' " +
        "from topic_actions a join categories_has_topics b on a.topic_id = b.topic_id " +
        "where a.action_type = 1 and b.category_id = :cate " +
        "and FROM_UNIXTIME( a.create_date/1000, '%Y%u' ) " +
        "between date_format(date_add(now(), interval -" + num + " week), '%Y%u') and date_format(now(), '%Y%u') " +
        "group by week order by week desc";

    var sql_order_by_month = "select from_unixtime(a.create_date/1000, '%Y%m') as 'month', count(a.id) as 'count' " +
        "from topic_actions a join categories_has_topics b on a.topic_id = b.topic_id " +
        "where a.action_type = 1 and b.category_id = :cate " +
        "and FROM_UNIXTIME( a.create_date/1000, '%Y%m' ) " +
        "between date_format(date_add(now(), interval -" + num + " month), '%Y%m') and date_format(now(), '%Y%m') " +
        "group by month order by month desc";

    switch(order){
        case "0":
            return [sql_total_by_day, sql_order_by_day];
        case "1":
            return [sql_total_by_week ,sql_order_by_week];
        case "2":
            return [sql_total_by_month,sql_order_by_month];
        default:
            return [sql_total_by_day, sql_order_by_day];
    }
}
