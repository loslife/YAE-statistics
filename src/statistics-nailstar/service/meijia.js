var _                    = require("underscore");
var async                = require("async");
var dbHelper             = require(FRAMEWORKPATH + "/utils/dbHelper");

exports.getCates         = getCates;
exports.getPostsWithCate = getPostsWithCate;
exports.getPostsWithKey  = getPostsWithKey;
exports.getPostsWithDate = getPostsWithDate;
exports.getPostImg		 = getPostImg;

//获取类别列表
function getCates (req,res,next) {
	var sql = "select id 'cate_id',name 'cate_name' from meijia_cates";
	dbHelper.execSql(sql, {}, function (err, data) {
        if (err) {
            return next(err);
        }
        doResponse(req, res, {cates: data});
    });
}

//根据类别获取帖子列表
function getPostsWithCate (req,res,next) {
	var page    = req.query.page;
	var perPage = req.query.perPage;
	var cate_id = req.query.cate_id;
	
	var startIndex 	= (page-1)*perPage;
	var result 		= {
		pageData:'',
		count:0
	};

	async.parallel([getCount, getData], function (err) {
		if(err){
            callback(err);
            return;
        }
        doResponse(req, res, result);
	});

	function getCount (callback) {
		var sql  = "select count(1) count from meijia_cates a left join meijia_posts b on a.id=b.cate_id where a.id=:cate_id";

		dbHelper.execSql(sql,{cate_id: cate_id},function (err,data) {
			if(err){
				callback(err);
				return;
			}
			result.count = data[0].count;
			callback(null);
		});
	}

	function getData (callback) {
		var sql = "select a.name 'cate_name',b.id 'post_id',b.title,b.nickname,b.avatar,create_time,b.content from meijia_cates a left join meijia_posts b on a.id=b.cate_id where a.id=:cate_id limit :startIndex,:perPage";

		dbHelper.execSql(sql,{cate_id: cate_id,startIndex: startIndex, perPage: parseInt(perPage)},function (err,data) {
			if(err){
				callback(err);
				return;
			}
			result.pageData = data;
			callback(null);
		});
	}
}

//根据关键字（标题、内容、作者）获取类别
function getPostsWithKey (req,res,next) {
	var page    = req.query.page;
	var perPage = req.query.perPage;
	var key     = req.query.key;
	
	var startIndex 	= (page-1)*perPage;
	var result 		= {
		pageData:'',
		count:0
	};

	async.parallel([getCount, getData], function (err) {
		if(err){
            callback(err);
            return;
        }
        doResponse(req, res, result);
	});

	function getCount (callback) {
		var sql  = "select count(1) count from meijia_cates a left join meijia_posts b on a.id=b.cate_id where b.title like '%"+key+"%' or b.nickname like '%"+key+"%' or b.content like '%"+key+"%'";

		dbHelper.execSql(sql,{key:key},function (err,data) {
			if(err){
				callback(err);
				return;
			}
			result.count = data[0].count;
			callback(null);
		});
	}

	function getData (callback) {
		var sql = "select a.name 'cate_name',b.id 'post_id',b.title,b.nickname,b.avatar,create_time,b.content from meijia_cates a left join meijia_posts b on a.id=b.cate_id where b.title like '%"+key+"%' or b.nickname like '%"+key+"%' or b.content like '%"+key+"%' order by abs(length(b.title)-length(:key)),abs(length(b.nickname)-length(:key)),abs(length(b.content)-length(:key)) limit :startIndex,:perPage";

		dbHelper.execSql(sql,{key: key,startIndex: startIndex, perPage: parseInt(perPage)},function (err,data) {
			if(err){
				callback(err);
				return;
			}
			result.pageData = data;
			callback(null);
		});
	}
}

//根据日期获取类别
function getPostsWithDate(req,res,next) {
	var page       = req.query.page;
	var perPage    = req.query.perPage;
	var start_date = req.query.start_date;
	var end_date   = req.query.end_date;
	var startIndex 	= (page-1)*perPage;
	var result 		= {
		pageData:'',
		count:0
	};

	async.parallel([getCount, getData], function (err) {
		if(err){
            callback(err);
            return;
        }
        doResponse(req, res, result);
	});

	function getCount (callback) {
		var sql  = "select count(1) count from meijia_cates a left join meijia_posts b on a.id=b.cate_id where b.create_time > :start_date and b.create_time < :end_date";

		dbHelper.execSql(sql,{start_date:start_date,end_date:end_date},function (err,data) {
			if(err){
				callback(err);
				return;
			}
			result.count = data[0].count;
			callback(null);
		});
	}

	function getData (callback) {
		var sql = "select a.name 'cate_name',b.id 'post_id',b.title,b.nickname,b.avatar,create_time,b.content from meijia_cates a left join meijia_posts b on a.id=b.cate_id where b.create_time > :start_date and b.create_time < :end_date order by b.create_time limit :startIndex,:perPage";

		dbHelper.execSql(sql,{start_date:start_date,end_date:end_date,startIndex: startIndex, perPage: parseInt(perPage)},function (err,data) {
			if(err){
				callback(err);
				return;
			}
			result.pageData = data;
			callback(null);
		});
	}
}

//根据id 获取帖子图片
function getPostImg(req,res,next) {
	var post_id = req.params["post_id"];

	var sql = "select b.url from meijia_posts a left join meijia_post_images b on a.id=b.post_id where a.id=:post_id";

	dbHelper.execSql(sql,{post_id: post_id},function (err,data) {
		if(err){
			callback(err);
			return;
		}
		doResponse(req, res, {images: data});
	});
}