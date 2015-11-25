var _ = require("underscore");
var async = require("async");
var dbHelper = require(FRAMEWORKPATH + "/utils/dbHelper");

exports.staticits = staticits;
exports.communitiesRanking = communitiesRanking;
exports.teacherCommunitiesRanking = teacherCommunitiesRanking;
exports.communitiesPostsCount = communitiesPostsCount;
exports.communitiesCommentsCount = communitiesCommentsCount;
exports.getAllcommunities = getAllcommunities;
exports.communitiesPostsSingleCount = communitiesPostsSingleCount;
exports.communitiesCommentsSingleCount = communitiesCommentsSingleCount;

// 点赞数
// 阅读量
// 圈子粉丝关注量
// 用户关注圈子的数量
// 注册用户平均关注的圈子个数
// 圈子评论数量
function staticits(req, res, next){

    var final_result = [];
    async.parallel([
        _queryPostLiked,
        _queryPostRead,
        _queryCommunityFans,
        _queryCommunityFollow,
        _queryCommunityComments
    ], function(err){
        if(err){
            return next(err);
        }
        doResponse(req, res, final_result);
    });

    // 点赞数
    function _queryPostLiked(nextStep){
        var sql = "select count(id) 'count' from post_actions where action_type = 2";
        dbHelper.execSql(sql, {}, function(err, result){
            if(err){
                return nextStep(err);
            }
            if(result && result[0]){
                final_result.push({
                    title: "点赞数",
                    value: result[0].count
                });
            }
            nextStep();
        });
    }
    // 阅读量
    function _queryPostRead(nextStep){
        var sql = "select count(id) 'count' from post_actions where action_type = 1";
        dbHelper.execSql(sql, {}, function(err, result){
            if(err){
                return nextStep(err);
            }
            if(result && result[0]){
                final_result.push({
                    title: "阅读量",
                    value: result[0].count
                });
            }
            nextStep();
        });
    }
    // 圈子粉丝关注量
    function _queryCommunityFans(nextStep){
        var sql = "select count(id) 'count' from communities_has_accounts";
        dbHelper.execSql(sql, {}, function(err, result){
            if(err){
                return nextStep(err);
            }
            if(result && result[0]){
                final_result.push({
                    title: "圈子粉丝关注量",
                    value: result[0].count
                });
            }
            nextStep();
        });
    }
    // 用户关注圈子的数量 & 注册用户平均关注的圈子个数
    function _queryCommunityFollow(nextStep){
        async.series([___queryCommunityFollowCount, ___queryCommunityFollowAverage], function(err){
            if(err){
                return nextStep(err);
            }
            nextStep();
        });

        var count = 0;
        function ___queryCommunityFollowCount(nextOne){
            var sql = "select count(distinct community_id) 'count' from communities_has_accounts";
            dbHelper.execSql(sql, {}, function(err, result){
                if(err){
                    return nextOne(err);
                }
                if(result && result[0]){
                    final_result.push({
                        title: "用户关注圈子的数量",
                        value: result[0].count
                    });
                    count = result[0].count;
                }
                nextOne();
            });
        }
        function ___queryCommunityFollowAverage(nextOne){
            var sql = "select count(id) 'count' from accounts";
            dbHelper.execSql(sql, {}, function(err, result){
                if(err){
                    return nextOne(err);
                }
                if(result && result[0]){
                    final_result.push({
                        title: "注册用户平均关注的圈子个数",
                        value: (count / result[0].count).toFixed(2)
                    });
                }
                nextOne();
            });
        }
    }
    // 圈子评论数量
    function _queryCommunityComments(nextStep){
        var sql = "select count(id) 'count' from post_comments";
        dbHelper.execSql(sql, {}, function(err, result){
            if(err){
                return nextStep(err);
            }
            if(result && result[0]){
                final_result.push({
                    title: "圈子评论数量",
                    value: result[0].count
                });
            }
            nextStep();
        });
    }
}

// 圈子活跃度排名（人数、总话题数、当日回复数、当日进入数）
function communitiesRanking(req, res, next){

    var num = parseInt(req.query.num) || 20;
    var rankby = parseInt(req.query.rankby) || 0;

    var sql = getSqlByRankBy(rankby);
    dbHelper.execSql(sql, {num: num}, function (err, result) {
        if (err) {
            return next(err);
        }
        doResponse(req, res, result);
    });

    function getSqlByRankBy(rankby) {
        var rankByAccounts = "select a.name 'name',count(b.id) 'count' " +
            "from communities a left join communities_has_accounts b on a.id = b.community_id " +
            "group by a.id " +
            "order by count desc,a.create_date limit 0,:num";
        var rankByPosts = "select a.name 'name',count(b.id) 'count' " +
            "from communities a left join posts b on a.id = b.community_id " +
            "group by a.id " +
            "order by count desc,a.create_date limit 0,:num";
        var rankByComments = "select a.name 'name',count(c.id) 'count' " +
            "from communities a left join posts b on a.id = b.community_id " +
            "left join post_comments c on b.id = c.post_id " +
            "and FROM_UNIXTIME( c.create_date/1000, '%Y-%m-%d') = curdate() " +
            "group by a.id " +
            "order by count desc,a.create_date limit 0,:num";
        var rankByEntry = "select a.name 'name',count(c.id) 'count' " +
            "from communities a left join posts b on a.id = b.community_id " +
            "left join post_actions c on b.id = c.post_id and c.action_type = 1 " +
            "and FROM_UNIXTIME( c.action_date/1000, '%Y-%m-%d') = curdate() " +
            "group by a.id " +
            "order by count desc,a.create_date limit 0,:num";
        switch (rankby) {
            case 0:
                // 按人数排名
                return rankByAccounts;
            case 1:
                // 按总话题数排行
                return rankByPosts;
            case 2:
                // 按当日回复数排行
                return rankByComments;
            case 3:
                // 按当日进入数排行
                return rankByEntry;
        }
    }
}

// 老师（官方）圈子活跃度排名（人数、总话题数、当日回复数、当日进入数）
function teacherCommunitiesRanking(req, res, next){

    var num = parseInt(req.query.num) || 20;
    var rankby = parseInt(req.query.rankby) || 0;

    var sql = getSqlByRankBy(rankby);
    dbHelper.execSql(sql, {num: num}, function (err, result) {
        if (err) {
            return next(err);
        }
        doResponse(req, res, result);
    });

    function getSqlByRankBy(rankby) {
        var rankByAccounts = "select a.name 'name',count(b.id) 'count' " +
            "from communities a left join communities_has_accounts b on a.id = b.community_id " +
            "where a.is_official = 1 " +
            "group by a.id " +
            "order by count desc limit 0,:num";
        var rankByPosts = "select a.name 'name',count(b.id) 'count' " +
            "from communities a left join posts b on a.id = b.community_id " +
            "where a.is_official = 1 " +
            "group by a.id " +
            "order by count desc limit 0,:num";
        var rankByComments = "select a.name 'name',count(c.id) 'count' " +
            "from communities a left join posts b on a.id = b.community_id " +
            "left join post_comments c on b.id = c.post_id " +
            "and FROM_UNIXTIME( c.create_date/1000, '%Y-%m-%d') = curdate() " +
            "where a.is_official = 1 " +
            "group by a.id " +
            "order by count desc limit 0,:num";
        var rankByEntry = "select a.name 'name',count(c.id) 'count' " +
            "from communities a left join posts b on a.id = b.community_id " +
            "left join post_actions c on b.id = c.post_id and c.action_type = 1 " +
            "and FROM_UNIXTIME( c.action_date/1000, '%Y-%m-%d') = curdate() " +
            "where a.is_official = 1 " +
            "group by a.id " +
            "order by count desc limit 0,:num";
        switch (rankby) {
            case 0:
                // 按人数排名
                return rankByAccounts;
            case 1:
                // 按总话题数排行
                return rankByPosts;
            case 2:
                // 按当日回复数排行
                return rankByComments;
            case 3:
                // 按当日进入数排行
                return rankByEntry;
        }
    }
}

//每日圈子发帖数
function communitiesPostsCount(req, res, next){

    var num = (parseInt(req.query["num"]) || 10) - 1;

    var sql = "select count(id) 'count',from_unixtime(create_date/1000, '%Y%m%d') 'time' from posts " +
        "where from_unixtime(create_date/1000, '%Y%m%d') " +
        "between date_format(date_add(now(), interval -" + num + " day), '%Y%m%d') and date_format(now(), '%Y%m%d') " +
        "group by time order by time desc";

    dbHelper.execSql(sql, {}, function(err, result){
        if(err){
            return next(err);
        }
        doResponse(req, res, result);
    });

}

//每日圈子评论数
function communitiesCommentsCount(req, res, next){

    var num = (parseInt(req.query["num"]) || 10) - 1;

    var sql = "select count(id) 'count',from_unixtime(create_date/1000, '%Y%m%d') 'time' from post_comments " +
        "where from_unixtime(create_date/1000, '%Y%m%d') " +
        "between date_format(date_add(now(), interval -" + num + " day), '%Y%m%d') and date_format(now(), '%Y%m%d') " +
        "group by time order by time desc ";

    dbHelper.execSql(sql, {}, function(err, result){
        if(err){
            return next(err);
        }
        doResponse(req, res, result);
    });

}

//获取所有圈子列表
function getAllcommunities(req, res, next){

    var sql = "select id,name from communities";

    dbHelper.execSql(sql, {}, function(err, result){
        if(err){
            return next(err);
        }
        doResponse(req, res, result);
    });
}

//单个圈子发帖数
function communitiesPostsSingleCount(req, res, next){

    var id = req.query["id"];
    if(!id){
        return next("缺失参数id");
    }
    var num = (parseInt(req.query["num"]) || 10) - 1;

    var sql = "select count(id) 'count',from_unixtime(create_date/1000, '%Y%m%d') 'time' " +
        "from posts " +
        "where community_id = :id and from_unixtime(create_date/1000, '%Y%m%d') " +
        "between date_format(date_add(now(), interval -" + num + " day), '%Y%m%d') and date_format(now(), '%Y%m%d') " +
        "group by time order by time desc ";

    dbHelper.execSql(sql, {id: id}, function(err, result){
        if(err){
            return next(err);
        }
        doResponse(req, res, result);
    });
}

//单个圈子评论数
function communitiesCommentsSingleCount(req, res, next){

    var id = req.query["id"];
    if(!id){
        return next("缺失参数id");
    }
    var num = (parseInt(req.query["num"]) || 10) - 1;

    var sql = "select count(a.id) 'count',from_unixtime(a.create_date/1000, '%Y%m%d') 'time' " +
        "from post_comments a join posts b on a.post_id = b.id " +
        "where b.community_id = :id and from_unixtime(a.create_date/1000, '%Y%m%d') " +
        "between date_format(date_add(now(), interval -" + num + " day), '%Y%m%d') and date_format(now(), '%Y%m%d') " +
        "group by time order by time desc ";

    dbHelper.execSql(sql, {id: id}, function(err, result){
        if(err){
            return next(err);
        }
        doResponse(req, res, result);
    });
}