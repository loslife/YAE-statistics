var request = require("request");
var _ = require("underscore");
var async = require("async");
var uuid = require('node-uuid');
var dbHelper = require(FRAMEWORKPATH + "/utils/dbHelper");
var logger = require(FRAMEWORKPATH + "/utils/logger").getLogger();

exports.exec = requestGroup;

//拉取分组信息
function requestGroup(){

    var group_url = "http://meijialove.com/v1/user/groups.json?fields=list%5B%5D.group_id%2Clist%5B%5D.name%2Clist%5B%5D.icon%2Clist%5B%5D.type%2Clist%5B%5D.ui_type%2Clist%5B%5D.can_create_topic%2Clist%5B%5D.topic_count%2Clist%5B%5D.comment_count%2Clist%5B%5D.update_count%2Clist%5B%5D.latest_topic.topic_id%2Clist%5B%5D.latest_topic.title%2Clist%5B%5D.latest_topic.create_time%2Clist%5B%5D.desc&type=custom";
    request.get(group_url, {json: true}, function(err, result, body){
        try {

            if (err) {
                return;
            }
            if (!body || !body.data) {
                return;
            }

            var data = body.data;

            data.list.forEach(function(item){

                //group信息入库
                var sql = "insert into meijia_cates(id,name) values(:id,:name)";
                dbHelper.execSql(sql, {id: item.group_id,name: item.name}, function(err){
                    if(err){
                        return logger.error(err);
                    }
                });

                requestPosts(item.group_id);
            });

        }catch(e){
            logger.error(e);
        }
    });
}

function requestPosts(id, offset){

    var limit = 24;
    if(!offset){
        offset = 0;
    }
    var post_url = "http://meijialove.com/v1/groups/" + id + "/topics.json?fields=list%5B%5D.topic_id%2Clist%5B%5D.title%2Clist%5B%5D.create_time%2Clist%5B%5D.latest_response_time%2Clist%5B%5D.comment_count%2Clist%5B%5D.author.uid%2Clist%5B%5D.author.nickname%2Clist%5B%5D.author.verified_type%2Clist%5B%5D.author.verified_desc%2Clist%5B%5D.author.avatar.s%28187%7Cwebp%7C0%29%2Clist%5B%5D.author.avatar.l%28750%7Cwebp%7C0%29%2Clist%5B%5D.view_count%2Clist%5B%5D.summary%2Clist%5B%5D.is_top%2Clist%5B%5D.front_cover.s%28187%7Cwebp%7C0%29%2Clist%5B%5D.front_cover.l%28750%7Cwebp%7C0%29%2Clist%5B%5D.images%5B%5D.s%28187%7Cwebp%7C0%29%2Clist%5B%5D.images%5B%5D.l%28750%7Cwebp%7C0%29&limit=" + limit + "&offset=" + offset + "&sortby=response_time%3Adesc";

    request.get(post_url, {json: true}, function(err, result, body){

        try {

            if (err) {
                return;
            }
            if (!body || !body.data) {
                return;
            }

            var data = body.data;

            _.each(data.list, function(item){
                requestPostDetails(item.topic_id, id);
            });

            //继续爬下一页
            if(data.list.length >= limit){
                requestPosts(id, offset + limit);
            }

        }catch(e){
            logger.error(e);
        }
    });
}

function requestPostDetails(id, group_id){

    var detail_url = "http://meijialove.com/v1/topics/" + id + ".json?fields=topic_id%2Ctitle%2Ccreate_time%2Ccontent_html%2Clatest_response_time%2Ccomment_count%2Cgroup.group_id%2Cgroup.type%2Cgroup.name%2Cgroup.icon%2Cgroup.icon%2Cgroup.ui_type%2Cgroup.can_create_topic%2Cgroup.topic_count%2Cgroup.comment_count%2Cgroup.update_count%2Cgroup.desc%2Cauthor.uid%2Cauthor.nickname%2Cauthor.introduce%2Cauthor.verified_type%2Cauthor.verified_desc%2Cauthor.avatar.s%28187%7Cwebp%7C0%29%2Cauthor.avatar.l%28750%7Cwebp%7C0%29%2Cview_count%2Csummary%2Cis_top%2Cfront_cover.s%28187%7Cwebp%7C0%29%2Cfront_cover.l%28750%7Cwebp%7C0%29%2Cimages%5B%5D.s%28187%7Cwebp%7C0%29%2Cimages%5B%5D.l%28750%7Cwebp%7C0%29%2Csns_share_entity.title%2Csns_share_entity.text%2Csns_share_entity.image_url%2Csns_share_entity.link_url%2Cview_count%2Cpraise_count%2Cpraised%2Cpraise_users%5B%5D.uid%2Cpraise_users%5B%5D.nickname%2Cpraise_users%5B%5D.avatar.s%28187%7Cwebp%7C0%29%2Cpraise_users%5B%5D.avatar.l%28750%7Cwebp%7C0%29%2Cpraise_users%5B%5D.verified_type%2Cpraise_users%5B%5D.verified_desc%2Ccollected%2Creferences%5B%5D.image%2Creferences%5B%5D.text%2Creferences%5B%5D.desc%2Creferences%5B%5D.app_route%2Calbums%5B%5D.album_id%2Calbums%5B%5D.name%2Calbums%5B%5D.desc%2Calbums%5B%5D.cover.s%28187%7Cwebp%7C0%29%2Calbums%5B%5D.cover.l%28750%7Cwebp%7C0%29%2Calbums%5B%5D.ui_type";

    request.get(detail_url, {json: true}, function(err, result, body){

        try{

            if(err){
                return;
            }
            if(!body || !body.data){
                return;
            }

            var data = body.data;

            var title = data.title;
            var nickname = data.author.nickname;
            var avatar = data.author.avatar.l.url;
            var create_time = data.create_time * 1000;
            var content = data.sns_share_entity.text;
            var images = [];
            data.images.forEach(function(item){
                images.push(item.l.url);
            });


            //帖子信息入库
            var sql = "insert into meijia_posts(id,cate_id,title,nickname,avatar,create_time,content) values(:id,:cate_id,:title,:nickname,:avatar,:create_time,:content)";
            var id = uuid.v1();
            dbHelper.execSql(sql, {
                id: id,
                cate_id: group_id,
                title: title,
                nickname: nickname,
                avatar: avatar,
                create_time: create_time,
                content: content
            }, function(err){
                if(err){
                    return logger.error(err);
                }
            });

            //图片信息入库
            var images_sql = "insert into meijia_post_images(id,post_id,url) values(:id,:post_id,:url)";
            var sqls = [];
            _.each(images, function(item){
                sqls.push({
                    statement: images_sql,
                    value: {
                        id: uuid.v1(),
                        post_id: id,
                        url: item
                    }
                });
            });
            dbHelper.bacthExecSql(sqls, function(err){
                if(err){
                    return logger.error(err);
                }
            });

        }catch(e){
            logger.error(e);
        }
    });
}