var _                    = require("underscore");
var async                = require("async");
var dbHelper             = require(FRAMEWORKPATH + "/utils/dbHelper");
var ossClient = require(FRAMEWORKPATH + "/utils/ossClient");
var materialDao = require("./materialDao");
var fs = require('fs');
var uuid              = require('node-uuid');
var sizeOf            = require('image-size');
var url               = require('url');
var http              = require('http');

exports.getCates         = getCates;
exports.getPostsWithCate = getPostsWithCate;
exports.getPostsWithKey  = getPostsWithKey;
exports.getPostsWithDate = getPostsWithDate;
exports.getPostImg		 = getPostImg;
exports.uploadPicture	 = uploadPicture;
exports.communityList = communityList;
exports.addPost = addPost;

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

//上传图片接口
function uploadPicture(req, res, next){
    req.form.on('progress', function (bytesReceived, bytesExpected) {
    });
    req.form.on('end', function () {
        var filePath = req.files.files[0].path;
        picfile ={
            size: req.files.files[0].size,
            url:"",
            upload_date:(new Date()).getTime()
        };
        async.series([upload2Oss,add2Db,deleteTempFile],function(error){
            if(error){
                logger.error(error);
                next(error);
            }else{
                doResponse(req, res, {
                    files:[picfile]
                });
            }
        })


        function upload2Oss(nextStep){
            ossClient.putPictureObjectToOss(filePath,function(error,ossObject){
                if(error){
                    nextStep(error);
                    return;
                }else{
                    picfile.url = ossObject.oss_url;
                    nextStep(null);
                }
            });
        }
        function add2Db(nextStep){
            materialDao.addPicture(picfile,function(error){
                if(error){
                    nextStep(error);
                }else{
                    nextStep(null, {
                        files:[picfile]
                    });
                }
            });
        }
        function deleteTempFile(nextStep){
            fs.unlink(filePath, function (error) {
                if (error) {
                    logger.error("删除文件：" + filePath + "失败");
                    logger.error(error);
                    nextStep(error);
                    return;
                }
                nextStep(null);
            });
        }
    });
}

//搜索可以创建帖子的圈子
function communityList (req, res, next) {
	var key = req.query.key;

	var sql = "select id 'community_id', name 'name' from "+
	"communities where (name like '%"+key+"%' or attr like '%"+key+"%') and status <> 2 and is_container=0"+
	" order by abs(length(name)-length(:key)),abs(length(attr)-length(:key))";

	dbHelper.execSql(sql, {key: key}, function (err, data) {
		if(err){
			callback(err);
			return;
		}
		doResponse(req, res, data);
	});
}

//添加帖子
function addPost (req, res, next) {
	var data = {
		id           : uuid.v1(),
		creator_id	 : req.body.creator_id, 
		community_id : req.body.community_id, 
		create_date  : (new Date()).getTime(), 
		title        : req.body.title, 
		content      : req.body.content, 
		is_hot       : req.body.is_hot, 
		is_top       : req.body.is_top,
		imgs 		 : req.body.imgs
	};

	//获取图片高度和宽度
	async.each(data.imgs, function(item, nextOne){
		http.get(url.parse(item.pic_url), function (response) {
            var chunks = [];
            response.on('data', function (chunk) {

                chunks.push(chunk);

            }).on('end', function() {

                var buffer = Buffer.concat(chunks);
                
                item.id = uuid.v1();
				item.serial_number = item.serial_number-1;
				item.width = sizeOf(buffer).width;
				item.height = sizeOf(buffer).height;
                nextOne(null);

            }).on("error", function(err){
                nextOne(err);
            });
        });

	}, function (err) {
		if(err){
			logger.error(err);
			return next(err);
		}
		addPosteData(data, function (err,result) {
			if(err){
				logger.error(err);
				next(err);
				return;
			}
			doResponse(req, res, result);
		});
	});
}

//新建帖子
function addPosteData (data, callback) {

	var result = {
		post:'',
		imgs:''
	};

	async.parallel([addPost, addPic], function (err) {
		if(err){
            callback(err);
            return;
        }
        callback(null,result);
	});

	//存到posts表
	function addPost (callback) {
		var sql = 'insert into posts (id, community_id, create_date, title, content, is_hot, is_top, account_id,ready,latest_reply_time) '+
		'values (:id, :community_id, :create_date, :title, :content, :is_hot, :is_top, :account_id, :ready, :latest_reply_time)';

		dbHelper.execSql(sql, {id: data.id, community_id: data.community_id, create_date: data.create_date, title: data.title, content: data.content, is_hot: data.is_hot, is_top: data.is_top, account_id: data.creator_id,ready:1,latest_reply_time: data.create_date}, function (err, data) {
			if(err){
				callback(err);
				return;
			}
			result.post = 'ok';
			callback(null);
		});
	}

	//将pic_url存到post_picture中
	function addPic (callback) {

		var sql = 'insert into post_pictures (id, post_id, pic_url, serial_number, width, height)'+
			'values (:id, :post_id, :pic_url, :serial_number, :width, :height)';
		var sqlArray = [];
		for (var i = 0; i < data.imgs.length; i++) {
			sqlArray.push({
				statement: sql,
				value: {
					id: data.imgs[i].id,
					post_id: data.id, 
					pic_url: data.imgs[i].pic_url, 
					serial_number: data.imgs[i].serial_number,
					width:  data.imgs[i].width,
					height: data.imgs[i].height
				}
			});
		}
		dbHelper.bacthExecSql(sqlArray, function(err){
			if(err){
				callback(err);
				return;
			}
			result.imgs = 'ok';
			callback(null);
		});
	}
}