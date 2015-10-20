var _ = require("underscore");
var async = require("async");
var dbHelper = require(FRAMEWORKPATH + "/utils/dbHelper");

exports.getCommentsAll = getCommentsAll;
exports.getCommentsByCate = getCommentsByCate;
exports.getCommentsByTopic = getCommentsByTopic;

//美甲大咖总评论数
function getCommentsAll(req, res, next) {

    var order = req.query["order"] || 0;
    var num = parseInt(req.query["num"]) || 10;

    var sqls = getAllSqlsByOrder(order, num);

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
        dbHelper.execSql(sqls[0], {}, function (err, rows) {

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
        dbHelper.execSql(sqls[1], {}, function (err, rows) {

            if (err) {
                console.log(err);
                nextStep(err);
                return;
            }

            obj.details = rows;
            nextStep();
        });
    }

    //内部函数：根据参数获取对应sql
    function getAllSqlsByOrder(order, num){

        var sql_total_by_day = "select count(1) as total " +
            "from comments a " +
            "where FROM_UNIXTIME( a.create_date/1000, '%Y%m%d') " +
            "between date_format(date_add(now(), interval -" + num + " day), '%Y%m%d') and date_format(now(), '%Y%m%d') ";

        var sql_total_by_week = "select count(1) as total " +
            "from comments a " +
            "where FROM_UNIXTIME( a.create_date/1000, '%Y%u') " +
            "between date_format(date_add(now(), interval -" + num + " week), '%Y%u') and date_format(now(), '%Y%u') ";

        var sql_total_by_month = "select count(1) as total " +
            "from comments a " +
            "where FROM_UNIXTIME( a.create_date/1000, '%Y%m%d') " +
            "between date_format(date_add(now(), interval -" + num + " month), '%Y%m') and date_format(now(), '%Y%m') ";

        var sql_order_by_day = "select from_unixtime(a.create_date/1000, '%Y%m%d') as 'time', count(a.id) as 'count' " +
            "from comments a " +
            "where FROM_UNIXTIME( a.create_date/1000, '%Y%m%d' ) " +
            "between date_format(date_add(now(), interval -" + num + " day), '%Y%m%d') and date_format(now(), '%Y%m%d') " +
            "group by time order by time desc";

        var sql_order_by_week = "select from_unixtime(a.create_date/1000, '%Y%u') as 'time', count(a.id) as 'count' " +
            "from comments a " +
            "where FROM_UNIXTIME( a.create_date/1000, '%Y%u' ) " +
            "between date_format(date_add(now(), interval -" + num + " week), '%Y%u') and date_format(now(), '%Y%u') " +
            "group by time order by time desc";

        var sql_order_by_month = "select from_unixtime(a.create_date/1000, '%Y%m') as 'time', count(a.id) as 'count' " +
            "from comments a " +
            "where FROM_UNIXTIME( a.create_date/1000, '%Y%m%d' ) " +
            "between date_format(date_add(now(), interval -" + num + " month), '%Y%m') and date_format(now(), '%Y%m') " +
            "group by time order by time desc";

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
}

//美甲大咖系列评论数
function getCommentsByCate(req, res, next){

    var cate = req.query["cate"];
    if(!cate){
        return next("缺失参数cate");
    }

    var order = req.query["order"] || 0;
    var num = parseInt(req.query["num"]) || 10;

    var sqls = getCateSqlsByOrder(order, num);

    var obj = {
        totalCount: 0,
        details: []
    };

    async.parallel([_queryTotal, _queryDetails], function(err, result){
        if(err){
            return next(err);
        }
        doResponse(req, res, obj);
    });

    function _queryTotal(nextStep){
        dbHelper.execSql(sqls[0], {cate: cate}, function (err, data) {
            if (err) {
                return nextStep(err);
            }
            obj.totalCount = data[0].count;
            nextStep();
        });
    }
    function _queryDetails(nextStep){
        dbHelper.execSql(sqls[1], {cate: cate}, function (err, data) {
            if (err) {
                return nextStep(err);
            }
            obj.details = data;
            nextStep();
        });
    }

    //内部函数：根据参数获取对应sql
    function getCateSqlsByOrder(order, num){

        var sql_total_by_day = "select count(1) as total " +
            "from comments a join categories_has_topics b on a.topic_id = b.topic_id " +
            "where b.category_id = :cate and FROM_UNIXTIME( a.create_date/1000, '%Y%m%d') " +
            "between date_format(date_add(now(), interval -" + num + " day), '%Y%m%d') and date_format(now(), '%Y%m%d') ";

        var sql_total_by_week = "select count(1) as total " +
            "from comments a join categories_has_topics b on a.topic_id = b.topic_id " +
            "where b.category_id = :cate and FROM_UNIXTIME( a.create_date/1000, '%Y%u') " +
            "between date_format(date_add(now(), interval -" + num + " week), '%Y%u') and date_format(now(), '%Y%u') ";

        var sql_total_by_month = "select count(1) as total " +
            "from comments a join categories_has_topics b on a.topic_id = b.topic_id " +
            "where b.category_id = :cate and FROM_UNIXTIME( a.create_date/1000, '%Y%m%d') " +
            "between date_format(date_add(now(), interval -" + num + " month), '%Y%m') and date_format(now(), '%Y%m') ";

        var sql_order_by_day = "select from_unixtime(a.create_date/1000, '%Y%m%d') as 'time', count(a.id) as 'count' " +
            "from comments a join categories_has_topics b on a.topic_id = b.topic_id " +
            "where b.category_id = :cate and FROM_UNIXTIME( a.create_date/1000, '%Y%m%d' ) " +
            "between date_format(date_add(now(), interval -" + num + " day), '%Y%m%d') and date_format(now(), '%Y%m%d') " +
            "group by time order by time desc";

        var sql_order_by_week = "select from_unixtime(a.create_date/1000, '%Y%u') as 'time', count(a.id) as 'count' " +
            "from comments a join categories_has_topics b on a.topic_id = b.topic_id " +
            "where b.category_id = :cate and FROM_UNIXTIME( a.create_date/1000, '%Y%u' ) " +
            "between date_format(date_add(now(), interval -" + num + " week), '%Y%u') and date_format(now(), '%Y%u') " +
            "group by time order by time desc";

        var sql_order_by_month = "select from_unixtime(a.create_date/1000, '%Y%m') as 'time', count(a.id) as 'count' " +
            "from comments a join categories_has_topics b on a.topic_id = b.topic_id " +
            "where b.category_id = :cate and FROM_UNIXTIME( a.create_date/1000, '%Y%m%d' ) " +
            "between date_format(date_add(now(), interval -" + num + " month), '%Y%m') and date_format(now(), '%Y%m') " +
            "group by time order by time desc";

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
}

//美甲大咖分期评论数
function getCommentsByTopic(req, res, next){

    var topicId = req.query["topicId"];
    if(!topicId){
        return next("缺失参数topicId");
    }

    var order = req.query["order"] || 0;
    var num = parseInt(req.query["num"]) || 10;

    var sqls = getTopicSqlsByOrder(order, num);

    var obj = {
        totalCount: 0,
        details: []
    };

    async.parallel([_queryTotal, _queryDetails], function(err, result){
        if(err){
            return next(err);
        }
        doResponse(req, res, obj);
    });

    function _queryTotal(nextStep){
        dbHelper.execSql(sqls[0], {topicId: topicId}, function (err, data) {
            if (err) {
                return nextStep(err);
            }
            obj.totalCount = data[0].count;
            nextStep();
        });
    }
    function _queryDetails(nextStep){
        dbHelper.execSql(sqls[1], {topicId: topicId}, function (err, data) {
            if (err) {
                return nextStep(err);
            }
            obj.details = data;
            nextStep();
        });
    }

    //内部函数：根据参数获取对应sql
    function getTopicSqlsByOrder(order, num){

        var sql_total_by_day = "select count(1) as total " +
            "from comments a join topics b on a.topic_id = b.id " +
            "where b.id = :topicId and FROM_UNIXTIME( a.create_date/1000, '%Y%m%d') " +
            "between date_format(date_add(now(), interval -" + num + " day), '%Y%m%d') and date_format(now(), '%Y%m%d') ";

        var sql_total_by_week = "select count(1) as total " +
            "from comments a join topics b on a.topic_id = b.id " +
            "where b.id = :topicId and FROM_UNIXTIME( a.create_date/1000, '%Y%u') " +
            "between date_format(date_add(now(), interval -" + num + " week), '%Y%u') and date_format(now(), '%Y%u') ";

        var sql_total_by_month = "select count(1) as total " +
            "from comments a join topics b on a.topic_id = b.id " +
            "where b.id = :topicId and FROM_UNIXTIME( a.create_date/1000, '%Y%m%d') " +
            "between date_format(date_add(now(), interval -" + num + " month), '%Y%m') and date_format(now(), '%Y%m') ";

        var sql_order_by_day = "select from_unixtime(a.create_date/1000, '%Y%m%d') as 'time', count(a.id) as 'count' " +
            "from comments a join topics b on a.topic_id = b.id " +
            "where b.id = :topicId and FROM_UNIXTIME( a.create_date/1000, '%Y%m%d' ) " +
            "between date_format(date_add(now(), interval -" + num + " day), '%Y%m%d') and date_format(now(), '%Y%m%d') " +
            "group by time order by time desc";

        var sql_order_by_week = "select from_unixtime(a.create_date/1000, '%Y%u') as 'time', count(a.id) as 'count' " +
            "from comments a join topics b on a.topic_id = b.id " +
            "where b.id = :topicId and FROM_UNIXTIME( a.create_date/1000, '%Y%u' ) " +
            "between date_format(date_add(now(), interval -" + num + " week), '%Y%u') and date_format(now(), '%Y%u') " +
            "group by time order by time desc";

        var sql_order_by_month = "select from_unixtime(a.create_date/1000, '%Y%m') as 'time', count(a.id) as 'count' " +
            "from comments a join topics b on a.topic_id = b.id " +
            "where b.id = :topicId and FROM_UNIXTIME( a.create_date/1000, '%Y%m%d' ) " +
            "between date_format(date_add(now(), interval -" + num + " month), '%Y%m') and date_format(now(), '%Y%m') " +
            "group by time order by time desc";

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
}


