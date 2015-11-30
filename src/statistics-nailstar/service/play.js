var _ = require("underscore");
var async = require("async");
var dbHelper = require(FRAMEWORKPATH + "/utils/dbHelper");

exports.getplayAll = getplayAll;
exports.getplayByCate = getplayByCate;
exports.getplayByTopic = getplayByTopic;
exports.getVideoShare = getVideoShare;
exports.getCateRanking = getCateRanking;

//美甲大咖总播放数
function getplayAll(req, res, next){

    var order = req.query["order"] || 0;
    var num = (parseInt(req.query["num"]) || 10) - 1;

    var obj = {
        totalCount: 0,
        details: [],
        appDetails: [],
        wechatDetails: []
    };

    var sqls = getSqlsByOrder(order, num);

    async.parallel([_queryTotal, _queryDetails, _queryAppDetails, _queryWechatDetails], function (err) {
        if(err){
            return next(err);
        }
        doResponse(req, res, obj);
    });

    function _queryTotal(nextStep){
        dbHelper.execSql(sqls[0], {}, function (err, result) {
            if (err) {
                return nextStep(err);
            }
            if(result && result[0]){
                obj.totalCount = result[0].total;
            }
            nextStep();
        });
    }
    function _queryDetails(nextStep){
        dbHelper.execSql(sqls[1], {}, function (err, result) {
            if (err) {
                return nextStep(err);
            }
            if(result && result[0]){
                obj.details = result;
            }
            nextStep();
        });
    }
    function _queryAppDetails(nextStep){
        dbHelper.execSql(sqls[2], {}, function (err, result) {
            if (err) {
                return nextStep(err);
            }
            if(result && result[0]){
                obj.appDetails = result;
            }
            nextStep();
        });
    }
    function _queryWechatDetails(nextStep){
        dbHelper.execSql(sqls[3], {}, function (err, result) {
            if (err) {
                return nextStep(err);
            }
            if(result && result[0]){
                obj.wechatDetails = result;
            }
            nextStep();
        });
    }

    //内部函数：根据参数获取对应播放数sql
    function getSqlsByOrder(order, num){

        var sql_total_by_day = "select count(1) as total " +
            "from topic_actions a where a.action_type = 1 " +
            "and FROM_UNIXTIME( a.create_date/1000, '%Y%m%d') " +
            "between date_format(date_add(now(), interval -" + num + " day), '%Y%m%d') and date_format(now(), '%Y%m%d') ";

        var sql_total_by_week = "select count(1) as total " +
            "from topic_actions a where a.action_type = 1 " +
            "and FROM_UNIXTIME( a.create_date/1000, '%Y%u' ) " +
            "between date_format(date_add(now(), interval -" + num + " week), '%Y%u') and date_format(now(), '%Y%u') ";

        var sql_total_by_month = "select count(1) as total " +
            "from topic_actions a where a.action_type = 1 " +
            "and FROM_UNIXTIME( a.create_date/1000, '%Y%m' ) " +
            "between date_format(date_add(now(), interval -" + num + " month), '%Y%m') and date_format(now(), '%Y%m') ";

        var sql_order_by_day = "select from_unixtime(a.create_date/1000, '%Y%m%d') as 'time', count(a.id) as 'count' " +
            "from topic_actions a where a.action_type = 1 " +
            "and FROM_UNIXTIME( a.create_date/1000, '%Y%m%d' ) " +
            "between date_format(date_add(now(), interval -" + num + " day), '%Y%m%d') and date_format(now(), '%Y%m%d') " +
            "group by time order by time desc";

        var sql_order_by_week = "select from_unixtime(a.create_date/1000, '%Y%u') as 'time', count(a.id) as 'count' " +
            "from topic_actions a where a.action_type = 1 " +
            "and FROM_UNIXTIME( a.create_date/1000, '%Y%u' ) " +
            "between date_format(date_add(now(), interval -" + num + " week), '%Y%u') and date_format(now(), '%Y%u') " +
            "group by time order by time desc";

        var sql_order_by_month = "select from_unixtime(a.create_date/1000, '%Y%m') as 'time', count(a.id) as 'count' " +
            "from topic_actions a where a.action_type = 1 " +
            "and FROM_UNIXTIME( a.create_date/1000, '%Y%m' ) " +
            "between date_format(date_add(now(), interval -" + num + " month), '%Y%m') and date_format(now(), '%Y%m') " +
            "group by time order by time desc";

        var sql_app_order_by_day = "select from_unixtime(a.create_date/1000, '%Y%m%d') as 'time', count(a.id) as 'count' " +
            "from topic_actions a where a.action_type = 1 and a.client = 0 " +
            "and FROM_UNIXTIME( a.create_date/1000, '%Y%m%d' ) " +
            "between date_format(date_add(now(), interval -" + num + " day), '%Y%m%d') and date_format(now(), '%Y%m%d') " +
            "group by time order by time desc";

        var sql_app_order_by_week = "select from_unixtime(a.create_date/1000, '%Y%u') as 'time', count(a.id) as 'count' " +
            "from topic_actions a where a.action_type = 1 and a.client = 0 " +
            "and FROM_UNIXTIME( a.create_date/1000, '%Y%u' ) " +
            "between date_format(date_add(now(), interval -" + num + " week), '%Y%u') and date_format(now(), '%Y%u') " +
            "group by time order by time desc";

        var sql_app_order_by_month = "select from_unixtime(a.create_date/1000, '%Y%m') as 'time', count(a.id) as 'count' " +
            "from topic_actions a where a.action_type = 1 and a.client = 0 " +
            "and FROM_UNIXTIME( a.create_date/1000, '%Y%m' ) " +
            "between date_format(date_add(now(), interval -" + num + " month), '%Y%m') and date_format(now(), '%Y%m') " +
            "group by time order by time desc";

        var sql_wechat_order_by_day = "select from_unixtime(a.create_date/1000, '%Y%m%d') as 'time', count(a.id) as 'count' " +
            "from topic_actions a where a.action_type = 1 and a.client = 1 " +
            "and FROM_UNIXTIME( a.create_date/1000, '%Y%m%d' ) " +
            "between date_format(date_add(now(), interval -" + num + " day), '%Y%m%d') and date_format(now(), '%Y%m%d') " +
            "group by time order by time desc";

        var sql_wechat_order_by_week = "select from_unixtime(a.create_date/1000, '%Y%u') as 'time', count(a.id) as 'count' " +
            "from topic_actions a where a.action_type = 1 and a.client = 1 " +
            "and FROM_UNIXTIME( a.create_date/1000, '%Y%u' ) " +
            "between date_format(date_add(now(), interval -" + num + " week), '%Y%u') and date_format(now(), '%Y%u') " +
            "group by time order by time desc";

        var sql_wechat_order_by_month = "select from_unixtime(a.create_date/1000, '%Y%m') as 'time', count(a.id) as 'count' " +
            "from topic_actions a where a.action_type = 1 and a.client = 1 " +
            "and FROM_UNIXTIME( a.create_date/1000, '%Y%m' ) " +
            "between date_format(date_add(now(), interval -" + num + " month), '%Y%m') and date_format(now(), '%Y%m') " +
            "group by time order by time desc";

        switch(order){
            case "0":
                return [sql_total_by_day, sql_order_by_day, sql_app_order_by_day, sql_wechat_order_by_day];
            case "1":
                return [sql_total_by_week ,sql_order_by_week, sql_app_order_by_week, sql_wechat_order_by_week];
            case "2":
                return [sql_total_by_month,sql_order_by_month, sql_app_order_by_month, sql_wechat_order_by_month];
            default:
                return [sql_total_by_day, sql_order_by_day, sql_app_order_by_day, sql_wechat_order_by_day];
        }
    }
}

//美甲大咖系列播放数
function getplayByCate(req, res, next) {

    var cate = req.query["cate"];
    if(!cate){
        return next("缺失参数cate");
    }

    var order = req.query["order"] || 0;
    var num = (parseInt(req.query["num"]) || 10) - 1;

    var sqls = getCateSqlsByOrder(order, num);

    var obj = {
        totalCount: 0,
        details: [],
        appDetails: [],
        wechatDetails: []
    };

    async.parallel([_queryTotal, _queryDetails, _queryAppDetails, _queryWechatDetails], function (err) {
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
    function _queryAppDetails(nextStep){
        dbHelper.execSql(sqls[2], {cate: cate}, function (err, rows) {
            if (err) {
                return nextStep(err);
            }
            if(rows && rows[0]){
                obj.appDetails = rows;
            }
            nextStep();
        });
    }
    function _queryWechatDetails(nextStep){
        dbHelper.execSql(sqls[3], {cate: cate}, function (err, rows) {
            if (err) {
                return nextStep(err);
            }
            if(rows && rows[0]){
                obj.wechatDetails = rows;
            }
            nextStep();
        });
    }

    //内部函数：根据参数获取对应系列播放数sql
    function getCateSqlsByOrder(order, num){

        var sql_total_by_day = "select count(1) as total " +
            "from topic_actions a join categories_has_topics b on a.topic_id = b.topic_id and a.action_type = 1 " +
            "where b.category_id = :cate and FROM_UNIXTIME( a.create_date/1000, '%Y%m%d') " +
            "between date_format(date_add(now(), interval -" + num + " day), '%Y%m%d') and date_format(now(), '%Y%m%d') ";

        var sql_total_by_week = "select count(1) as total " +
            "from topic_actions a join categories_has_topics b on a.topic_id = b.topic_id and a.action_type = 1 " +
            "where b.category_id = :cate and FROM_UNIXTIME( a.create_date/1000, '%Y%u' ) " +
            "between date_format(date_add(now(), interval -" + num + " week), '%Y%u') and date_format(now(), '%Y%u') ";

        var sql_total_by_month = "select count(1) as total " +
            "from topic_actions a join categories_has_topics b on a.topic_id = b.topic_id and a.action_type = 1 " +
            "where b.category_id = :cate and FROM_UNIXTIME( a.create_date/1000, '%Y%m' ) " +
            "between date_format(date_add(now(), interval -" + num + " month), '%Y%m') and date_format(now(), '%Y%m') ";

        var sql_order_by_day = "select from_unixtime(a.create_date/1000, '%Y%m%d') as 'time', count(a.id) as 'count' " +
            "from topic_actions a join categories_has_topics b on a.topic_id = b.topic_id and a.action_type = 1 " +
            "where b.category_id = :cate and FROM_UNIXTIME( a.create_date/1000, '%Y%m%d' ) " +
            "between date_format(date_add(now(), interval -" + num + " day), '%Y%m%d') and date_format(now(), '%Y%m%d') " +
            "group by time order by time desc";

        var sql_order_by_week = "select from_unixtime(a.create_date/1000, '%Y%u') as 'time', count(a.id) as 'count' " +
            "from topic_actions a join categories_has_topics b on a.topic_id = b.topic_id and a.action_type = 1 " +
            "where b.category_id = :cate and FROM_UNIXTIME( a.create_date/1000, '%Y%u' ) " +
            "between date_format(date_add(now(), interval -" + num + " week), '%Y%u') and date_format(now(), '%Y%u') " +
            "group by time order by time desc";

        var sql_order_by_month = "select from_unixtime(a.create_date/1000, '%Y%m') as 'time', count(a.id) as 'count' " +
            "from topic_actions a join categories_has_topics b on a.topic_id = b.topic_id and a.action_type = 1 " +
            "where b.category_id = :cate and FROM_UNIXTIME( a.create_date/1000, '%Y%m' ) " +
            "between date_format(date_add(now(), interval -" + num + " month), '%Y%m') and date_format(now(), '%Y%m') " +
            "group by time order by time desc";

        var sql_app_order_by_day = "select from_unixtime(a.create_date/1000, '%Y%m%d') as 'time', count(a.id) as 'count' " +
            "from topic_actions a join categories_has_topics b on a.topic_id = b.topic_id and a.action_type = 1 and a.client = 0 " +
            "where b.category_id = :cate and FROM_UNIXTIME( a.create_date/1000, '%Y%m%d' ) " +
            "between date_format(date_add(now(), interval -" + num + " day), '%Y%m%d') and date_format(now(), '%Y%m%d') " +
            "group by time order by time desc";

        var sql_app_order_by_week = "select from_unixtime(a.create_date/1000, '%Y%u') as 'time', count(a.id) as 'count' " +
            "from topic_actions a join categories_has_topics b on a.topic_id = b.topic_id and a.action_type = 1 and a.client = 0 " +
            "where b.category_id = :cate and FROM_UNIXTIME( a.create_date/1000, '%Y%u' ) " +
            "between date_format(date_add(now(), interval -" + num + " week), '%Y%u') and date_format(now(), '%Y%u') " +
            "group by time order by time desc";

        var sql_app_order_by_month = "select from_unixtime(a.create_date/1000, '%Y%m') as 'time', count(a.id) as 'count' " +
            "from topic_actions a join categories_has_topics b on a.topic_id = b.topic_id and a.action_type = 1 and a.client = 0 " +
            "where b.category_id = :cate and FROM_UNIXTIME( a.create_date/1000, '%Y%m' ) " +
            "between date_format(date_add(now(), interval -" + num + " month), '%Y%m') and date_format(now(), '%Y%m') " +
            "group by time order by time desc";

        var sql_wechat_order_by_day = "select from_unixtime(a.create_date/1000, '%Y%m%d') as 'time', count(a.id) as 'count' " +
            "from topic_actions a join categories_has_topics b on a.topic_id = b.topic_id and a.action_type = 1 and a.client = 1 " +
            "where b.category_id = :cate and FROM_UNIXTIME( a.create_date/1000, '%Y%m%d' ) " +
            "between date_format(date_add(now(), interval -" + num + " day), '%Y%m%d') and date_format(now(), '%Y%m%d') " +
            "group by time order by time desc";

        var sql_wechat_order_by_week = "select from_unixtime(a.create_date/1000, '%Y%u') as 'time', count(a.id) as 'count' " +
            "from topic_actions a join categories_has_topics b on a.topic_id = b.topic_id and a.action_type = 1 and a.client = 1 " +
            "where b.category_id = :cate and FROM_UNIXTIME( a.create_date/1000, '%Y%u' ) " +
            "between date_format(date_add(now(), interval -" + num + " week), '%Y%u') and date_format(now(), '%Y%u') " +
            "group by time order by time desc";

        var sql_wechat_order_by_month = "select from_unixtime(a.create_date/1000, '%Y%m') as 'time', count(a.id) as 'count' " +
            "from topic_actions a join categories_has_topics b on a.topic_id = b.topic_id and a.action_type = 1 and a.client = 1 " +
            "where b.category_id = :cate and FROM_UNIXTIME( a.create_date/1000, '%Y%m' ) " +
            "between date_format(date_add(now(), interval -" + num + " month), '%Y%m') and date_format(now(), '%Y%m') " +
            "group by time order by time desc";

        switch(order){
            case "0":
                return [sql_total_by_day, sql_order_by_day, sql_app_order_by_day, sql_wechat_order_by_day];
            case "1":
                return [sql_total_by_week ,sql_order_by_week, sql_app_order_by_week, sql_wechat_order_by_week];
            case "2":
                return [sql_total_by_month,sql_order_by_month, sql_app_order_by_month, sql_wechat_order_by_month];
            default:
                return [sql_total_by_day, sql_order_by_day, sql_app_order_by_day, sql_wechat_order_by_day];
        }
    }
}

//美甲大咖分期播放数
function getplayByTopic(req, res, next){

    var topicId = req.query["topicId"];
    if(!topicId){
        return next("缺失参数topicId");
    }

    var order = req.query["order"] || 0;
    var num = (parseInt(req.query["num"]) || 10) - 1;

    var sqls = getTopicSqlsByOrder(order, num);

    var obj = {
        totalCount: 0,
        details: [],
        appDetails: [],
        wechatDetails: []
    };

    async.parallel([_queryTotal, _queryPlayByNo, _queryAppDetails, _queryWechatDetails], function(err, result){
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
            obj.totalCount = data[0].total;
            nextStep();
        });
    }
    function _queryPlayByNo(nextStep){
        dbHelper.execSql(sqls[1], {topicId: topicId}, function (err, data) {
            if (err) {
                return nextStep(err);
            }
            obj.details = data;
            nextStep();
        });
    }
    function _queryAppDetails(nextStep){
        dbHelper.execSql(sqls[2], {topicId: topicId}, function (err, data) {
            if (err) {
                return nextStep(err);
            }
            if(data && data[0]){
                obj.appDetails = data;
            }
            nextStep();
        });
    }
    function _queryWechatDetails(nextStep){
        dbHelper.execSql(sqls[3], {topicId: topicId}, function (err, data) {
            if (err) {
                return nextStep(err);
            }
            if(data && data[0]){
                obj.wechatDetails = data;
            }
            nextStep();
        });
    }

    //内部函数：根据参数获取对应分期播放数sql
    function getTopicSqlsByOrder(order, num){

        var sql_total_by_day = "select count(1) as total " +
            "from topic_actions a where a.topic_id = :topicId and a.action_type = 1 " +
            "and FROM_UNIXTIME( a.create_date/1000, '%Y%m%d') " +
            "between date_format(date_add(now(), interval -" + num + " day), '%Y%m%d') and date_format(now(), '%Y%m%d') ";

        var sql_total_by_week = "select count(1) as total " +
            "from topic_actions a where a.topic_id = :topicId and a.action_type = 1 " +
            "and FROM_UNIXTIME( a.create_date/1000, '%Y%u' ) " +
            "between date_format(date_add(now(), interval -" + num + " week), '%Y%u') and date_format(now(), '%Y%u') ";

        var sql_total_by_month = "select count(1) as total " +
            "from topic_actions a where a.topic_id = :topicId and a.action_type = 1 " +
            "and FROM_UNIXTIME( a.create_date/1000, '%Y%m' ) " +
            "between date_format(date_add(now(), interval -" + num + " month), '%Y%m') and date_format(now(), '%Y%m') ";

        var sql_order_by_day = "select from_unixtime(a.create_date/1000, '%Y%m%d') as 'time', count(a.id) as 'count' " +
            "from topic_actions a where a.topic_id = :topicId and a.action_type = 1 " +
            "and FROM_UNIXTIME( a.create_date/1000, '%Y%m%d' ) " +
            "between date_format(date_add(now(), interval -" + num + " day), '%Y%m%d') and date_format(now(), '%Y%m%d') " +
            "group by time order by time desc";

        var sql_order_by_week = "select from_unixtime(a.create_date/1000, '%Y%u') as 'time', count(a.id) as 'count' " +
            "from topic_actions a where a.topic_id = :topicId and a.action_type = 1 " +
            "and FROM_UNIXTIME( a.create_date/1000, '%Y%u' ) " +
            "between date_format(date_add(now(), interval -" + num + " week), '%Y%u') and date_format(now(), '%Y%u') " +
            "group by time order by time desc";

        var sql_order_by_month = "select from_unixtime(a.create_date/1000, '%Y%m') as 'time', count(a.id) as 'count' " +
            "from topic_actions a where a.topic_id = :topicId and a.action_type = 1 " +
            "and FROM_UNIXTIME( a.create_date/1000, '%Y%m' ) " +
            "between date_format(date_add(now(), interval -" + num + " month), '%Y%m') and date_format(now(), '%Y%m') " +
            "group by time order by time desc";

        var sql_app_order_by_day = "select from_unixtime(a.create_date/1000, '%Y%m%d') as 'time', count(a.id) as 'count' " +
            "from topic_actions a where a.topic_id = :topicId and a.action_type = 1 and a.client = 0 " +
            "and FROM_UNIXTIME( a.create_date/1000, '%Y%m%d' ) " +
            "between date_format(date_add(now(), interval -" + num + " day), '%Y%m%d') and date_format(now(), '%Y%m%d') " +
            "group by time order by time desc";

        var sql_app_order_by_week = "select from_unixtime(a.create_date/1000, '%Y%u') as 'time', count(a.id) as 'count' " +
            "from topic_actions a where a.topic_id = :topicId and a.action_type = 1 and a.client = 0 " +
            "and FROM_UNIXTIME( a.create_date/1000, '%Y%u' ) " +
            "between date_format(date_add(now(), interval -" + num + " week), '%Y%u') and date_format(now(), '%Y%u') " +
            "group by time order by time desc";

        var sql_app_order_by_month = "select from_unixtime(a.create_date/1000, '%Y%m') as 'time', count(a.id) as 'count' " +
            "from topic_actions a where a.topic_id = :topicId and a.action_type = 1 and a.client = 0 " +
            "and FROM_UNIXTIME( a.create_date/1000, '%Y%m' ) " +
            "between date_format(date_add(now(), interval -" + num + " month), '%Y%m') and date_format(now(), '%Y%m') " +
            "group by time order by time desc";

        var sql_wechat_order_by_day = "select from_unixtime(a.create_date/1000, '%Y%m%d') as 'time', count(a.id) as 'count' " +
            "from topic_actions a where a.topic_id = :topicId and a.action_type = 1 and a.client = 1 " +
            "and FROM_UNIXTIME( a.create_date/1000, '%Y%m%d' ) " +
            "between date_format(date_add(now(), interval -" + num + " day), '%Y%m%d') and date_format(now(), '%Y%m%d') " +
            "group by time order by time desc";

        var sql_wechat_order_by_week = "select from_unixtime(a.create_date/1000, '%Y%u') as 'time', count(a.id) as 'count' " +
            "from topic_actions a where a.topic_id = :topicId and a.action_type = 1 and a.client = 1 " +
            "and FROM_UNIXTIME( a.create_date/1000, '%Y%u' ) " +
            "between date_format(date_add(now(), interval -" + num + " week), '%Y%u') and date_format(now(), '%Y%u') " +
            "group by time order by time desc";

        var sql_wechat_order_by_month = "select from_unixtime(a.create_date/1000, '%Y%m') as 'time', count(a.id) as 'count' " +
            "from topic_actions a where a.topic_id = :topicId and a.action_type = 1 and a.client = 1 " +
            "and FROM_UNIXTIME( a.create_date/1000, '%Y%m' ) " +
            "between date_format(date_add(now(), interval -" + num + " month), '%Y%m') and date_format(now(), '%Y%m') " +
            "group by time order by time desc";

        switch(order){
            case "0":
                return [sql_total_by_day, sql_order_by_day, sql_app_order_by_day, sql_wechat_order_by_day];
            case "1":
                return [sql_total_by_week ,sql_order_by_week, sql_app_order_by_week, sql_wechat_order_by_week];
            case "2":
                return [sql_total_by_month,sql_order_by_month, sql_app_order_by_month, sql_wechat_order_by_month];
            default:
                return [sql_total_by_day, sql_order_by_day, sql_app_order_by_day, sql_wechat_order_by_day];
        }
    }
}

//视频转发数
function getVideoShare(req, res, next){

    var sql = "select count(a.id) 'value',b.title 'title' " +
        "from topic_actions a join topics b on a.topic_id = b.id " +
        "where a.action_type = 4 " +
        "group by a.topic_id " +
        "order by value desc";

    dbHelper.execSql(sql, {}, function(err, result){
        if(err){
            return next(err);
        }
        doResponse(req, res, result);
    });
}

//板块点击数排行榜
function getCateRanking(req, res, next){

    var sql = "select name 'title',click_count 'value' from topic_categories order by click_count desc";

    dbHelper.execSql(sql, {}, function(err, result){
        if(err){
            return next(err);
        }
        doResponse(req, res, result);
    });
}