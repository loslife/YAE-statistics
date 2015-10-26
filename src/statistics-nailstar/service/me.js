var _ = require("underscore");
var async = require("async");
var dbHelper = require(FRAMEWORKPATH + "/utils/dbHelper");

exports.statistics = statistics;
exports.fansRanking = fansRanking;
exports.followsRanking = followsRanking;
exports.followCount = followCount;
exports.detailsLikeRanking = detailsLikeRanking;
exports.detailsLikeCount = detailsLikeCount;
exports.detailsCommentsRanking = detailsCommentsRanking;
exports.detailsCommentsCount = detailsCommentsCount;

//我的页面数据统计
function statistics(req, res, next) {

    var final_result = {
        infos: []
    };

    async.parallel([
        _queryFollowAndAverage,
        _queryBackgroundChangeRate,
        _queryPhotoChangeRate
    ], function(err){
        if(err){
            return next(err);
        }
        doResponse(req, res, final_result);
    });

    //总关注数&平均每人关注数
    function _queryFollowAndAverage(nextStep){

        var follow = 0;
        async.series([_queryFollowCount, _queryAverageFollow], function(err){
            if(err){
                return nextStep(err);
            }
            nextStep();
        });

        //总关注数
        function _queryFollowCount(nextOne){

            var sql = "select count(id) 'follow' from account_relations";
            dbHelper.execSql(sql, {}, function (err, result) {
                if (err) {
                    return nextOne(err);
                }
                if(result && result[0]){
                    follow = result[0].follow;
                    final_result.infos.push({
                        title: "总关注数",
                        value: result[0].follow
                    });
                }
                nextOne();
            });
        }

        //平均每人关注数
        function _queryAverageFollow(nextOne){

            var sql = "select count(id) 'count' from accounts";
            dbHelper.execSql(sql, {}, function (err, result) {
                if (err) {
                    return nextOne(err);
                }
                if(result && result[0]){
                    final_result.infos.push({
                        title: "平均每人关注数",
                        value: (follow / result[0].count).toFixed(2)
                    });
                }
                nextOne();
            });
        }
    }


    //注册用户修改背景图片率
    function _queryBackgroundChangeRate(nextStep){

        var sql = "select count(homepage_background)/count(id) 'background_rate' from accounts";
        dbHelper.execSql(sql, {}, function (err, result) {
            if (err) {
                return nextStep(err);
            }
            if(result && result[0]){
                final_result.infos.push({
                    title: "注册用户修改背景图片率",
                    value: (result[0].background_rate * 100).toFixed(2) + "%"
                });
            }
            nextStep();
        });
    }

    //注册用户修改个人图像率
    function _queryPhotoChangeRate(nextStep){

        var sql = "select count(photo_url)/count(id) 'photo_rate' from accounts";
        dbHelper.execSql(sql, {}, function (err, result) {
            if (err) {
                return nextStep(err);
            }
            if(result && result[0]){
                final_result.infos.push({
                    title: "注册用户修改个人图像率",
                    value: (result[0].photo_rate * 100).toFixed(2) + "%"
                });
            }
            nextStep();
        });
    }


}

//粉丝数排行榜
function fansRanking(req, res, next){
    var num = parseInt(req.query.num) || 20;
    var sql = "select b.nickname 'nickname',count(a.id) 'count' from " +
        "account_relations a join accounts b on a.account_id = b.id " +
        "group by a.account_id order by count desc limit 0,:num";
    dbHelper.execSql(sql, {num: num}, function (err, result) {
        if (err) {
            return next(err);
        }
        doResponse(req, res, result);
    });
}

//关注数排行榜
function followsRanking(req, res, next){
    var num = parseInt(req.query.num) || 20;
    var sql = "select b.nickname 'nickname',count(a.id) 'count' from " +
        "account_relations a join accounts b on a.follower_id = b.id " +
        "group by a.follower_id order by count desc limit 0,:num";
    dbHelper.execSql(sql, {num: num}, function (err, result) {
        if (err) {
            return next(err);
        }
        doResponse(req, res, result);
    });
}

//每日新增关注数
function followCount(req, res, next){
    var num = parseInt(req.query.num) || 20;
    var sql = "select from_unixtime(create_date/1000, '%Y%m%d') as 'time', count(id) as 'count' " +
        "from account_relations_history " +
        "where action_type = 1 and FROM_UNIXTIME( create_date/1000, '%Y%m%d' ) " +
        "between date_format(date_add(now(), interval -" + num + " day), '%Y%m%d') and date_format(now(), '%Y%m%d') " +
        "group by time order by time desc";
    dbHelper.execSql(sql, {}, function (err, result) {
        if (err) {
            return next(err);
        }
        doResponse(req, res, result);
    });
}

//点赞排行榜（视频点赞、评论点赞、帖子点赞）
function detailsLikeRanking(req, res, next){
    var num = parseInt(req.query.num) || 20;
    var sql = "select r.nickname 'nickname',count(l.id) 'count' from " +
        "(select a.id 'id',b.account_id 'account_id' from " +
        "topic_actions a join topics b on a.topic_id = b.id where a.action_type = 2 " +
        "union " +
        "select a.id 'id',b.account_id 'account_id' from " +
        "comment_actions a join comments b on a.comment_id = b.id where a.action_type = 2 " +
        "union " +
        "select a.id 'id',b.account_id 'account_id' from " +
        "post_actions a join posts b on a.post_id = b.id where a.action_type = 2) l " +
        "join accounts r on l.account_id = r.id group by l.account_id order by count desc limit 0,:num";
    dbHelper.execSql(sql, {num: num}, function (err, result) {
        if (err) {
            return next(err);
        }
        doResponse(req, res, result);
    });
}

//每日点赞数
function detailsLikeCount(req, res, next){

    var num = parseInt(req.query.num) || 20;
    var details_result = {
        totalCount: 0,
        details: []
    };

    async.parallel([_queryLikeCount, _queryLikeByDay], function(err, result){
        if(err){
            return next(err);
        }
        doResponse(req, res, details_result);
    });

    function _queryLikeCount(nextStep){
        var sql = "select count(1) 'count' from " +
            "(select a.id 'id',a.create_date 'create_date' from " +
            "topic_actions a join topics b on a.topic_id = b.id where a.action_type = 2 " +
            "union " +
            "select a.id 'id',a.create_date 'create_date' from " +
            "comment_actions a join comments b on a.comment_id = b.id where a.action_type = 2 " +
            "union " +
            "select a.id 'id',a.action_date 'create_date' from " +
            "post_actions a join posts b on a.post_id = b.id where a.action_type = 2) t";
        dbHelper.execSql(sql, {}, function (err, result) {
            if (err) {
                return nextStep(err);
            }
            if(result && result[0]){
                details_result.totalCount = result[0].count;
            }
            nextStep();
        });
    }

    function _queryLikeByDay(nextStep){
        var sql = "select FROM_UNIXTIME( t.create_date/1000, '%Y%m%d' ) 'time',count(t.id) 'count' from " +
            "(select a.id 'id',a.create_date 'create_date' from " +
            "topic_actions a join topics b on a.topic_id = b.id where a.action_type = 2 " +
            "union " +
            "select a.id 'id',a.create_date 'create_date' from " +
            "comment_actions a join comments b on a.comment_id = b.id where a.action_type = 2 " +
            "union " +
            "select a.id 'id',a.action_date 'create_date' from " +
            "post_actions a join posts b on a.post_id = b.id where a.action_type = 2) t " +
            "where FROM_UNIXTIME( t.create_date/1000, '%Y%m%d' ) " +
            "between date_format(date_add(now(), interval -" + num + " day), '%Y%m%d') and date_format(now(), '%Y%m%d') " +
            "group by time order by count desc";
        dbHelper.execSql(sql, {}, function (err, result) {
            if (err) {
                return next(err);
            }
            if(result){
                details_result.details = result;
            }
            nextStep();
        });
    }

}

//评论排行榜（视频评论、交作业评论、帖子评论）
function detailsCommentsRanking(req, res, next){
    var num = parseInt(req.query.num) || 20;
    var sql = "select p.nickname 'nickname',count(t.id) 'count' from " +
        "(select a.id 'id',b.account_id 'account_id' from " +
        "comments a join topics b on a.topic_id = b.id where a.reply_to is null " +
        "union " +
        "select b.id 'id',c.id 'account_id' from " +
        "comments a join comments b on a.id = b.reply_to and a.isHomework = 1 join accounts c on a.account_id = c.id " +
        "union " +
        "select a.id 'id',b.id 'account_id' from post_comments a join accounts b on a.account_id = b.id) t " +
        "join accounts p on t.account_id = p.id " +
        "group by t.account_id order by count desc limit 0,:num";
    dbHelper.execSql(sql, {num: num}, function (err, result) {
        if (err) {
            return next(err);
        }
        doResponse(req, res, result);
    });
}

//每日评论数
function detailsCommentsCount(req, res, next){

    var num = parseInt(req.query.num) || 20;
    var details_result = {
        totalCount: 0,
        details: []
    };

    async.parallel([_queryLikeCount, _queryLikeByDay], function(err, result){
        if(err){
            return next(err);
        }
        doResponse(req, res, details_result);
    });

    function _queryLikeCount(nextStep){
        var sql = "select count(1) 'count' from " +
            "(select a.id 'id' from " +
            "comments a join topics b on a.topic_id = b.id where a.reply_to is null " +
            "union " +
            "select a.id 'id' from " +
            "comments a join comments b on a.id = b.reply_to and a.isHomework = 1 join accounts c on a.account_id = c.id " +
            "union " +
            "select a.id 'id' from " +
            "post_comments a join accounts b on a.account_id = b.id) t";
        dbHelper.execSql(sql, {}, function (err, result) {
            if (err) {
                return nextStep(err);
            }
            if(result && result[0]){
                details_result.totalCount = result[0].count;
            }
            nextStep();
        });
    }

    function _queryLikeByDay(nextStep){
        var sql = "select FROM_UNIXTIME( create_date/1000, '%Y%m%d' ) 'time',count(id) 'count' from " +
            "(select a.id 'id',a.create_date 'create_date' from " +
            "comments a join topics b on a.topic_id = b.id where a.reply_to is null " +
            "union " +
            "select a.id 'id',a.create_date 'create_date' from " +
            "comments a join accounts b on a.account_id = b.id where a.reply_to is null and a.isHomework = 1 " +
            "union " +
            "select a.id 'id',a.create_date 'create_date' from " +
            "post_comments a join accounts b on a.account_id = b.id) t " +
            "where FROM_UNIXTIME( t.create_date/1000, '%Y%m%d' ) " +
            "between date_format(date_add(now(), interval -" + num + " day), '%Y%m%d') " +
            "and date_format(now(), '%Y%m%d') " +
            "group by time order by time desc";
        dbHelper.execSql(sql, {}, function (err, result) {
            if (err) {
                return next(err);
            }
            if(result){
                details_result.details = result;
            }
            nextStep();
        });
    }

}