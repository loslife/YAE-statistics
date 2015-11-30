var _ = require("underscore");
var async = require("async");
var dbHelper = require(FRAMEWORKPATH + "/utils/dbHelper");

exports.getCategories = getCategories;
exports.getTopics = getTopics;

//获取视频分类列表接口
function getCategories(req, res, next) {
    var sql = "select id,name from topic_categories order by serial_number";
    dbHelper.execSql(sql, {}, function (err, data) {
        if (err) {
            return next(err);
        }
        doResponse(req, res, {cates: data});
    });
}

//获取视频主题列表接口
function getTopics(req, res, next){
    var sql = "select id,title 'name' from topics order by create_date desc";
    dbHelper.execSql(sql, {}, function (err, data) {
        if (err) {
            return next(err);
        }
        doResponse(req, res, {topics: data});
    });
}