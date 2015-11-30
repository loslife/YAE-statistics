var _ = require("underscore");
var async = require("async");
var dbHelper = require(FRAMEWORKPATH + "/utils/dbHelper");

exports.expRanking = expRanking;
exports.coinRanking = coinRanking;
exports.expAndCoinAnalyse = expAndCoinAnalyse;
exports.expAndCoinCount = expAndCoinCount;
exports.targetRanking = targetRanking;

//经验值排行榜
function expRanking(req, res, next){

    var num = parseInt(req.query.num) || 20;

    var sql = "select nickname,exp from accounts order by exp desc limit 0,:num";
    dbHelper.execSql(sql, {num: num}, function (err, result) {
        if (err) {
            return next(err);
        }
        doResponse(req, res, result);
    });
}

//咖币排行榜
function coinRanking(req, res, next){

    var num = parseInt(req.query.num) || 20;

    var sql = "select nickname,coin from accounts order by coin desc limit 0,:num";
    dbHelper.execSql(sql, {num: num}, function (err, result) {
        if (err) {
            return next(err);
        }
        doResponse(req, res, result);
    });
}

//注册用户经验、咖币的总数和平均数
function expAndCoinAnalyse(req, res, next){

    var final_result = [];
    async.series([_queryExpAndCoinCount, _queryAverageExpAndCoin], function(err){
        if(err){
            return next(err);
        }
        doResponse(req, res, final_result);
    });

    var exps = 0,coins = 0;
    function _queryExpAndCoinCount(nextStep){

        var sql = "select sum(exp) 'exps',sum(coin) 'coins' from accounts";
        dbHelper.execSql(sql, {}, function (err, result) {
            if (err) {
                return nextStep(err);
            }
            if(result && result[0]){
                final_result.push({
                    title: "总经验值",
                    value: result[0].exps
                });
                final_result.push({
                    title: "总咖币",
                    value: result[0].coins
                });
                exps = result[0].exps;
                coins = result[0].coins;
            }
            nextStep();
        });
    }

    function _queryAverageExpAndCoin(nextStep){
        var sql = "select count(1) 'count' from accounts";
        dbHelper.execSql(sql, {}, function (err, result) {
            if (err) {
                return nextStep(err);
            }
            if(result && result[0]){
                final_result.push({
                    title: "注册用户人均经验值",
                    value: (exps / result[0].count).toFixed(2)
                });
                final_result.push({
                    title: "注册用户人均咖币",
                    value: (coins / result[0].count).toFixed(2)
                });
            }
            nextStep();
        });
    }
}

//注册用户每日获得经验、咖币的总数和平均数
function expAndCoinCount(req, res, next){

    var num = parseInt(req.query.num) || 20;

    var accountsCount = 0;
    var final_result = [];
    async.series([_queryAccountsCount, _queryExpAndCoinCount], function(err){
        if(err){
            return next(err);
        }
        doResponse(req, res, final_result);
    });

    function _queryAccountsCount(nextStep){
        var sql = "select count(1) 'count' from accounts";
        dbHelper.execSql(sql, {}, function (err, result) {
            if (err) {
                return nextStep(err);
            }
            if(result && result[0]){
                accountsCount = result[0].count;
            }
            nextStep();
        });
    }

    function _queryExpAndCoinCount(nextStep){

        var sql = "select from_unixtime(action_date/1000, '%Y%m%d') 'time'," +
            "IFNULL(sum(get_exp),0) 'exps',IFNULL(sum(get_coin),0) 'coins'," +
            "FORMAT(IFNULL(sum(get_exp),0)/" + accountsCount + ",2) as 'avgexp', FORMAT(IFNULL(sum(get_coin),0)/" + accountsCount + ",2) as 'avgcoin' " +
            "from actions_history " +
            "where FROM_UNIXTIME( action_date/1000, '%Y%m%d' ) " +
            "between date_format(date_add(now(), interval -" + num + " day), '%Y%m%d') and date_format(now(), '%Y%m%d') " +
            "group by time order by time desc";
        dbHelper.execSql(sql, {}, function (err, result) {
            if (err) {
                return nextStep(err);
            }
            if(result){
                final_result = result;
            }
            nextStep();
        });
    }
}

//经验指标获取排行榜
function targetRanking(req, res, next){

    var num = parseInt(req.query.num) || 20;
    var target = parseInt(req.query.target);

    var sql = "select count(a.id) 'count',b.nickname 'nickname' " +
        "from actions_history a left join accounts b on a.account_id = b.id " +
        "where a.action = :target group by a.account_id order by count desc limit 0,:num";
    dbHelper.execSql(sql, {target: target,num: num}, function (err, result) {
        if (err) {
            return next(err);
        }
        doResponse(req, res, result);
    });
}
