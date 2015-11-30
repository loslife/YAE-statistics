var _                    = require("underscore");
var async                = require("async");
var dbHelper             = require(FRAMEWORKPATH + "/utils/dbHelper");

exports.getCates         = getCates;
exports.getPostsWithCate = getPostsWithCate;
exports.getPostsWithKey  = getPostsWithKey;
exports.getPostsWithDate = getPostsWithDate;

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
}