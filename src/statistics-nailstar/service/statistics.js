var mysql = require('mysql');
var _ = require("underscore");
var request = require("request");
var async = require("async");
var wxApi = require("wechat-toolkit");

var databaseParams = {
    host     : 'yilosdev.mysql.rds.aliyuncs.com',
    user     : 'yilos_dev',
    password : 'yilos_dev',
    database : 'nailstar'
};

var dbPool = mysql.createPool(databaseParams);

exports.users = users;

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

        dbPool.getConnection(function(err, connection) {

            if(err){
                console.log(err);
                temp.value = "查询失败";
                callback(null);
                return;
            }

            connection.query(sql, function(err, rows) {

                if(err){
                    console.log(err);
                    connection.release();
                    temp.value = "查询失败";
                    callback(null);
                    return;
                }

                temp.value = rows[0].total;
                connection.release();
                callback(null);
            });
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

        var sql = "select count(1) as total from accounts";

        dbPool.getConnection(function(err, connection) {

            if (err) {
                console.log(err);
                temp.value = "查询失败";
                callback(null);
                return;
            }

            connection.query(sql, function(err, rows) {

                if(err){
                    console.log(err);
                    connection.release();
                    temp.value = "查询失败";
                    callback(null);
                    return;
                }

                temp.value = rows[0].total;
                connection.release();
                callback(null);
            });
        });
    }
}