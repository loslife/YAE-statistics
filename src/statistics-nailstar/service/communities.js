var _ = require("underscore");
var async = require("async");
var dbHelper = require(FRAMEWORKPATH + "/utils/dbHelper");

exports.staticits = staticits;

// 点赞数
// 阅读量
// 圈子粉丝关注量
// 用户关注圈子的数量
// 注册用户平均关注的圈子个数
// 圈子评论数量
function staticits(req, res, next){

    var final_result = {};
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
                final_result["点赞数"] = result[0].count;
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
                final_result["阅读量"] = result[0].count;
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
                final_result["圈子粉丝关注量"] = result[0].count;
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

        function ___queryCommunityFollowCount(nextOne){
            var sql = "select count(distinct community_id) 'count' from communities_has_accounts";
            dbHelper.execSql(sql, {}, function(err, result){
                if(err){
                    return nextOne(err);
                }
                if(result && result[0]){
                    final_result["用户关注圈子的数量"] = result[0].count;
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
                    final_result["注册用户平均关注的圈子个数"] = final_result["用户关注圈子的数量"] / result[0].count;
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
                final_result["圈子评论数量"] = result[0].count;
            }
            nextStep();
        });
    }
}
