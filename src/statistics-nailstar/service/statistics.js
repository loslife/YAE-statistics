var _ = require("underscore");
var request = require("request");
var async = require("async");
var wxApi = require("wechat-toolkit");
var dbHelper = require(FRAMEWORKPATH + "/utils/dbHelper");

exports.users = users;
exports.findUser = findUser;
exports.homeworkRanking = homeworkRanking;
exports.topicCommentRanking = topicCommentRanking;
exports.postCommentRanking = postCommentRanking;

//用户统计详情
function users(req, res, next){

    var obj = {
        infos: []
    };

    async.parallel([_queryRegister, _queryWechat, _queryUmeng, _queryDownload], function(err){

        if(err){
            console.log(err);
        }

        doResponse(req, res, obj);
    });

    function _queryRegister(callback){

        var temp = {
            title: "注册用户"
        };
        obj.infos.push(temp);

        var sql = "select count(1) as total from accounts";

        dbHelper.execSql(sql, {}, function(err, rows) {

            if(err){
                console.log(err);
                temp.value = "查询失败";
                callback(null);
                return;
            }

            temp.value = rows[0].total;
            callback(null);
        });
    }

    function _queryWechat(callback){

        var temp = {
            title: "微信关注"
        };
        obj.infos.push(temp);

        var options = {
            method: "GET",
            uri: "http://wx.naildaka.com/wx/getAccessToken?appid=wxa84c9db4a6fcc7d8",
            json: true
        };

        request(options, function(err, response, body){

            if(err){
                console.log(err);
                temp.value = "查询失败";
                callback(null);
                return;
            }

            if(body.code != 0){
                console.log("获取access_token失败");
                temp.value = "查询失败";
                callback(null);
                return;
            }

            var access_token = body.result;

            wxApi.getFans(access_token, null, function(err, body){
                if(err || !body || body == undefined || !body.total || body.total == undefined){
                    console.log(err);
                    temp.value = "查询失败";
                    callback(null);
                    return;
                }
                temp.value = body.total;
                callback(null);
            });
        });
    }

    function _queryUmeng(callback){

        var install = {
            title: "APP装机量"
        };

        var weekA = {
            title: "过去7天活跃用户"
        };

        var MonthA = {
            title: "过去30天活跃用户"
        };

        var ava = {
            title: "过去7天平均日使用时长"
        };


        obj.infos.push(install);
        obj.infos.push(weekA);
        obj.infos.push(MonthA);
        obj.infos.push(ava);

        var crawler = require('./crawler_request');

        var url = "http://www.umeng.com/apps/839000de1e5c89dfd9382155/reports/load_table_data?stats=dashboard_trend";

        crawler.get(url, function(err, response){

            if(err){
                console.log(err);
                install.value = "抓取失败，需要刷新友盟cookie";
                weekA.value = "抓取失败，需要刷新友盟cookie";
                MonthA.value = "抓取失败，需要刷新友盟cookie";
                ava.value = "抓取失败，需要刷新友盟cookie";
                callback(null);
                return;
            }

            try{
                var body = JSON.parse(response.body);
                install.value = body.stats.install.amount;
                weekA.value = body.stats.last7day_active_user.amount;
                MonthA.value = body.stats.last30day_active_user.amount;
                ava.value = body.stats.last7day_daily_duration.amount;
            }catch(exception){
                console.log(exception);
                install.value = "抓取失败，需要刷新友盟cookie";
                weekA.value = "抓取失败，需要刷新友盟cookie";
                MonthA.value = "抓取失败，需要刷新友盟cookie";
                ava.value = "抓取失败，需要刷新友盟cookie";
            }finally{
                callback(null);
            }
        });
    }

    function _queryDownload(callback){
        var temp = {
            title: "视频下载数"
        };
        obj.infos.push(temp);

        var sql = "select count(1) as total from topic_actions where action_type = 5";

        dbHelper.execSql(sql, {}, function(err, rows) {

            if(err){
                console.log(err);
                temp.value = "查询失败";
                callback(null);
                return;
            }

            temp.value = rows[0].total;
            callback(null);
        });
    }
}

//用户资料查询
function findUser(req, res, next){
    
}

//交作业排行榜
function homeworkRanking(req, res, next){
    var sql = "select b.nickname 'nickname',count(a.id) 'total' " +
        "from comments a join accounts b on a.account_id = b.id " +
        "where a.content_pic is not null and a.content_pic <> '' " +
        "group by a.account_id order by total desc limit 0,50";
    dbHelper.execSql(sql, {}, function(err, result){
        if(err){
            return next(err);
        }
        doResponse(req, res, result);
    });
}

//视频评论排行榜
function topicCommentRanking(req, res, next){
    var sql = "select b.nickname 'nickname',count(a.account_id) 'total' " +
        "from comments a join accounts b on a.account_id = b.id " +
        "where content_pic is null and reply_to is null " +
        "group by a.account_id order by total desc limit 0,50";
    dbHelper.execSql(sql, {}, function(err, result){
        if(err){
            return next(err);
        }
        doResponse(req, res, result);
    });
}

//帖子评论排行榜
function postCommentRanking(req, res, next){
    var sql = "select b.nickname 'nickname',count(a.account_id) 'total' " +
        "from post_comments a join accounts b on a.account_id = b.id " +
        "where reply_to is null " +
        "group by a.account_id order by total desc limit 0,50";
    dbHelper.execSql(sql, {}, function(err, result){
        if(err){
            return next(err);
        }
        doResponse(req, res, result);
    });
}