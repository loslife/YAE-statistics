var mysql = require('mysql');
var _ = require("underscore");
var async = require("async");

var databaseParams = {
    host: 'yilosdev.mysql.rds.aliyuncs.com',
    user: 'yilos_dev',
    password: 'yilos_dev',
    database: 'nailstar'
};

var dbPool = mysql.createPool(databaseParams);

exports.qjcPicCount = qjcPicCount;
exports.qjcVoteCount = qjcVoteCount;

//求教程每期上传图片数量统计接口
function qjcPicCount(req, res, next) {

    var num = parseInt(req.query["num"]) || 10;

    var sql = "select b.id 'no', sum(a.vote_num) 'count' " +
        "from candidates a join activities b ON a.activity_id = b.id " +
        "group by b.id order by b.id desc limit 0 , ?";

    dbPool.getConnection(function (err, connection) {

        if (err) {
            next(err);
            if(connection){
                connection.release();
            }
            return;
        }
        connection.query(sql, [num], function (err, result) {

            if(connection){
                connection.release();
            }
            if (err) {
                return next(err);
            }
            var data = {details: result};
            doResponse(req, res, data);
        });

    });
}

//求教程每期投票总数统计接口
function qjcVoteCount(req, res, next) {

    var num = parseInt(req.query["num"]) || 10;

    var sql = "select b.id 'no', count(a.id) 'count' " +
        "from candidates a join activities b ON a.activity_id = b.id " +
        "group by b.id order by b.id desc limit 0 , ?";

    dbPool.getConnection(function (err, connection) {

        if (err) {
            next(err);
            if(connection){
                connection.release();
            }
            return;
        }
        connection.query(sql, [num], function (err, result) {
            if(connection){
                connection.release();
            }
            if (err) {
                return next(err);
            }
            var data = {details: result};
            doResponse(req, res, data);
        });

    });
}