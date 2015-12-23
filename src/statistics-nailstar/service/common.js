var _ = require("underscore");
var async = require("async");
var dbHelper = require(FRAMEWORKPATH + "/utils/dbHelper");

exports.getCategories = getCategories;
exports.getTopics = getTopics;
exports.getPicAndTxt = getPicAndTxt;

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

//获取主题中的图文接口
function getPicAndTxt (req, res, next) {
    var result = {
        pictures:'',
        articles:''
    }
    var topicId = req.params["topicId"];

    async.parallel([_queryPictures, _queryArticles], function(err, data){

        if(err) return next(err);

       
        return doResponse(req, res, result);
    });

    //查询图片数组信息
    function _queryPictures(callback){

        var sql = "select b.url 'url',b.id 'id' " +
            "from topics_has_pictures a join pictures b on a.picture_id = b.id " +
            "where a.topic_id = :topic_id order by a.serial_number";

        dbHelper.execSql(sql, {topic_id: topicId}, function(err, data){

            if(err) return callback(err);

            result.pictures = [];
            _.each(data, function(item){
                result.pictures.push(item);
            });

            return callback(null);
        });
    }

    //查询文章数组信息
    function _queryArticles(callback){

        var sql = "select b.content 'content' " +
            "from topics_has_articles a join articles b on a.article_id = b.id " +
            "where a.topic_id = :topic_id order by a.serial_number";

        dbHelper.execSql(sql, {topic_id: topicId}, function(err, data){

            if(err) return callback(err);

            result.articles = [];
            _.each(data, function(item){
                    result.articles.push(item["content"]);
            });

            return callback(null);  
        });
    }
}