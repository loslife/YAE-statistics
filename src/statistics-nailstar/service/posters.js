var _ = require("underscore");
var async = require("async");
var dbHelper = require(FRAMEWORKPATH + "/utils/dbHelper");

exports.posters = posters;

//轮播图数据统计
function posters(req, res, next) {

    var sql = "select a.id 'id',FROM_UNIXTIME(a.create_date/1000, '%Y%m%d') 'create_date'," +
        "FROM_UNIXTIME(a.end_date/1000, '%Y%m%d') 'end_date',d.play_times 'plat_times',count(e.id) 'total' " +
        "from posters a join topics b on a.topic_id = b.id " +
        "left join topics_has_videos c on b.id = c.topic_id " +
        "left join videos d on c.video_id = d.id " +
        "left join comments e on b.id = e.topic_id " +
        "group by a.id " +
        "order by a.create_date desc";
    dbHelper.execSql(sql, {}, function(err, result){
        if(err){
            return next(err);
        }
        doResponse(req, res, result);
    });
}