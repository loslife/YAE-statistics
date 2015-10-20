var _ = require("underscore");
var async = require("async");
var dbHelper = require(FRAMEWORKPATH + "/utils/dbHelper");

exports.getNewestActivity = getNewestActivity;
exports.qjcPicCount = qjcPicCount;
exports.qjcVoteCount = qjcVoteCount;
exports.qjcPlayCount = qjcPlayCount;
exports.qjcCommentsCount = qjcCommentsCount;

//获取最新活动期数
function getNewestActivity(req, res, next){
    var sql = "select max(id) 'no' from activities";
    dbHelper.execSql(sql, {}, function (err, row) {
        if (err) {
            next(err);
            return;
        }
        doResponse(req, res, row[0]);
    });
}

//求教程每期投票总数统计接口
function qjcVoteCount(req, res, next) {

    var num = parseInt(req.query["num"]) || 10;

    var sql = "select b.id 'no', sum(a.vote_num) 'count' " +
        "from candidates a join activities b ON a.activity_id = b.id " +
        "group by b.id order by b.id desc limit 0,:num";

    dbHelper.execSql(sql, {num: num}, function (err, result) {
        if (err) {
            return next(err);
        }
        var data = {details: result};
        doResponse(req, res, data);
    });
}

//求教程每期上传图片数量统计接口
function qjcPicCount(req, res, next) {

    var num = parseInt(req.query["num"]) || 10;

    var sql = "select b.id 'no', count(a.id) 'count' " +
        "from candidates a join activities b ON a.activity_id = b.id " +
        "group by b.id order by b.id desc limit 0,:num";

    dbHelper.execSql(sql, {num: num}, function (err, result) {
        if (err) {
            return next(err);
        }
        var data = {details: result};
        doResponse(req, res, data);
    });
}

//求教程视频播放数
function qjcPlayCount(req, res, next){

    var num = parseInt(req.query["num"]) || 10;

    var sql = "select a.id 'no',IFNULL(c.play_times,0) 'count' " +
        "from activities a left join topics_has_videos b on a.topic_id = b.topic_id" +
        " left join videos c on b.video_id = c.id order by no desc limit 0,:num";
    dbHelper.execSql(sql, {num: num}, function (err, result) {
        if (err) {
            return next(err);
        }
        var data = {details: result};
        doResponse(req, res, data);
    });
}

//求教程视频评论数
function qjcCommentsCount(req, res, next){

    var num = parseInt(req.query["num"]) || 10;

    var sql = "select a.id 'no',count(a.id) 'count' " +
        "from activities a left join comments b on a.topic_id = b.topic_id " +
        "group by no desc limit 0,:num";
    dbHelper.execSql(sql, {num: num}, function (err, result) {
        if (err) {
            return next(err);
        }
        var data = {details: result};
        doResponse(req, res, data);
    });
}