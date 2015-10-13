var _ = require("underscore");
var async = require("async");
var dbHelper = require(FRAMEWORKPATH + "/utils/dbHelper");

exports.expRanking = expRanking;
exports.coinRanking = coinRanking;
exports.expAndCoinAnalyse = expAndCoinAnalyse;

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
