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

    var order = req.query["order"] || 10;

    var sql = "select FROM_UNIXTIME( a.create_date/1000, '%Y%m%d' ) 'date',count(a.id) 'count' " +
        "from candidates a " +
        "where FROM_UNIXTIME( a.create_date/1000, '%Y%m%d' ) " +
        "between date_format(date_add(now(), interval -" + order + " day), '%Y%m%d') " +
        "and date_format(now(), '%Y%m%d') group by date";

    dbPool.getConnection(function (err, connection) {

        if (err) {
            return next(err);
        }
        connection.query(sql, {}, function (err, result) {
            if (err) {
                return next(err);
            }
            var data = {details: result};
            doResponse(req, res, data);
            connection.release();
        });

    });
}

//求教程每期投票总数统计接口
function qjcVoteCount(req, res, next) {

    var order = req.query["order"] || 10;

    var sql = "select FROM_UNIXTIME( a.create_date/1000, '%Y%m%d' ) 'date',sum(a.vote_num) 'count' " +
        "from candidates a " +
        "where FROM_UNIXTIME( a.create_date/1000, '%Y%m%d' ) " +
        "between date_format(date_add(now(), interval -" + order + " day), '%Y%m%d') " +
        "and date_format(now(), '%Y%m%d') group by date";

    dbPool.getConnection(function (err, connection) {

        if (err) {
            return next(err);
        }
        connection.query(sql, {}, function (err, result) {
            if (err) {
                return next(err);
            }
            var data = {details: result};
            doResponse(req, res, data);
            connection.release();
        });

    });
}