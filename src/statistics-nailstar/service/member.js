var _ = require("underscore");
var async = require("async");
var dbHelper = require(FRAMEWORKPATH + "/utils/dbHelper");

exports.expRanking = expRanking;
exports.coinRanking = coinRanking;
exports.expAndCoinAnalyse = expAndCoinAnalyse;
exports.expAndCoinCount = expAndCoinCount;

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

    var final_result = {
        exps: 0,
        coins: 0,
        avgexp: 0,
        avgcoin: 0
    };
    async.series([_queryExpAndCoinCount, _queryAverageExpAndCoin], function(err){
        if(err){
            return next(err);
        }
        var result = {
            "总经验值": final_result.exps,
            "注册用户人均经验值": final_result.avgexp,
            "总咖币": final_result.coins,
            "注册用户人均咖币": final_result.avgcoin
        };
        doResponse(req, res, result);
    });

    function _queryExpAndCoinCount(nextStep){

        var sql = "select sum(exp) 'exps',sum(coin) 'coins' from accounts";
        dbHelper.execSql(sql, {}, function (err, result) {
            if (err) {
                return nextStep(err);
            }
            if(result && result[0]){
                final_result.exps = result[0].exps;
                final_result.coins = result[0].coins;
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
                final_result.avgexp = (final_result.exps / result[0].count).toFixed(2);
                final_result.avgcoin = (final_result.coins / result[0].count).toFixed(2);
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

        var sql = "select from_unixtime(action_date/1000, '%Y%m%d') as 'day'," +
            "sum(get_exp) 'exps',sum(get_coin) 'coins'," +
            "sum(get_exp)/" + accountsCount + " as 'avgexp', sum(get_coin)/" + accountsCount + " as 'avgcoin'" +
            "from actions_history " +
            "where FROM_UNIXTIME( action_date/1000, '%Y%m%d' ) " +
            "between date_format(date_add(now(), interval -" + num + " day), '%Y%m%d') and date_format(now(), '%Y%m%d') " +
            "group by day order by day desc";
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
