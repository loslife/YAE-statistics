var sqlHelper = require(FRAMEWORKPATH + "/db/sqlHelper");
var dbHelper = require(FRAMEWORKPATH + "/utils/dbHelper");
var uuid = require('node-uuid');

//视频表操作
exports.addVideo = addVideo;
exports.addPicture = addPicture;
exports.updateVideo = updateVideo;
exports.deleteVideo = deleteVideo;
exports.listVideo = listVideo;
exports.quertVideoTotal = quertVideoTotal;

//图片表操作

//文章


function addVideo(video,callback){
    var sqlArray = [];
    video.id  = uuid.v1();
    sqlArray.push(sqlHelper.getServerInsertSqlOfObj(null, "videos", video));
    dbHelper.bacthExecSql(sqlArray, callback);
}

function addPicture(picture,callback){
    var sqlArray = [];
    picture.id  = uuid.v1();
    sqlArray.push(sqlHelper.getServerInsertSqlOfObj(null, "pictures", picture));
    dbHelper.bacthExecSql(sqlArray, callback);
}

function updateVideo(){
    callback(null);
}

function deleteVideo(id,callback){
    var sql = "delete from videos where  id=:id";
    dbHelper.execSql(sql, {id:id}, function (error, result) {
        if (error) {
            callback(error);
            return
        }
        callback(null,result);
    });
}

function listVideo(whereSql,whereVar,callback){
    var sql = "select * from videos where "+ (whereSql?whereSql:" 1=1 ");
    dbHelper.execSql(sql, whereVar, function (error, result) {
        if (error) {
            callback(error);
            return
        }
        callback(null,result);
    });
}

// whereSql: 'id = :id and name = :name'
// whereVar: {id: xxx, name: xxx}
function quertVideoTotal(whereSql,whereVar,callback){
    var sql = "select count(1) as no from videos where "+(whereSql ? whereSql:" 1=1 ");
    dbHelper.execSql(sql, whereVar, function (error, result) {
        if (error) {
            callback(error);
            return
        }
        callback(null,result[0].no);
    });
}

