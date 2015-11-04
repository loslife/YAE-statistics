## 用户统计详情

url: /svc/dakatongji/users

response:

	{
		infos: [
			{
				title: "注册用户",
				value: 5005
			},
			{
				title: "微信关注",
				value: 5006
			},
			...
		]
	}
	
## 用户名模糊搜索

url: /svc/dakatongji/findUserNickname

response:

	[
	    {
	        id: "0dec3780-0b4d-11e5-a235-d951ef48c38d",
	        nickname: "Kelly",
	        username: "13957733024"
	    },
	    {
            id: "0dec3780-0b4d-11e5-a235-d951ef48c38d",
            nickname: "Kelly",
            username: "13957733024"
        }
        ...
	]
	
## 用户资料查询

url: /svc/dakatongji/findUserDetails

query:
    
    id=xxxxx

response:

    {
        "username": "18874882110",
        "nickname": "微笑的星星",
        "type": 2,
        "gender": 1,
        "birthday": 492969600000,
        "location": "湖南省 长沙市",
        "create_date": null,
        "exp": 60,
        "coin": 66
    }
    
## 用户评论分页查询

url: /svc/dakatongji/findUserCommentDetails

query:
    
    id=xxxxx
    page=0
    perPage=10

response:

    [
        {
          "title": "第225期：夏日星空",
          "content": "每时每刻新款休闲鞋快点快点看快点看看",
          "create_date": 1445586282173
        },
        {
          "title": "第225期：夏日星空",
          "content": "开始上课上课看",
          "create_date": 1445586271523
        }
        ...
    ]
    
## 用户交作业分页查询

url: /svc/dakatongji/findUserHomeworkDetails

query:
    
    id=xxxxx
    page=0
    perPage=10

response:

    [
        {
          "title": "第225期：夏日星空",
          "content": "开思考思考开始看看",
          "pic": "http://pic.yilos.com/e2aca82e48422a5ff9cb86637d219dcd",
          "create_date": 1445583092956
        },
        {
          "title": "第125期：紫色星空",
          "content": "是咔咔咔咔咔咖捉襟见肘就自己你不是说啥哈哈哈哈哈时候会吧吧吧吧爱爱后",
          "pic": "http://pic.yilos.com/a077a935ee6c070482b9ef97f210e681",
          "create_date": 1445500793176
        }
        ...
    ]

## 交作业排行榜

url: /svc/dakatongji/homeworkRanking

response:
	
	[
        {
          "id": "sdasdas",
          "username": "sdsdsd",
          "nickname": "Lolo",
          "total": 74
        },
        {
          "id": "sdasdas",
          "username": "sdsdsd",
          "nickname": "手机用户0528",
          "total": 27
        }
        ...
    ]

## 视频评论排行榜

url: /svc/dakatongji/topicCommentRanking

response:
	
	[
        {
          "id": "sdasdas",
          "username": "sdsdsd",
          "nickname": "Lolo",
          "total": 74
        },
        {
          "id": "sdasdas",
          "username": "sdsdsd",
          "nickname": "手机用户0528",
          "total": 27
        }
        ...
    ]

## 帖子评论排行榜

url: /svc/dakatongji/postCommentRanking

response:
	
	[
        {
          "id": "sdasdas",
          "username": "sdsdsd",
          "nickname": "Lolo",
          "total": 74
        },
        {
          "id": "sdasdas",
          "username": "sdsdsd",
          "nickname": "手机用户0528",
          "total": 27
        }
        ...
    ]