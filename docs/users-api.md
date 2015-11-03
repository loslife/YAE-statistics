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
    
## 用户交作业分页查询

url: /svc/dakatongji/findUserHomeworkDetails

query:
    
    id=xxxxx
    page=0
    perPage=10

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

## 交作业排行榜

url: /svc/dakatongji/homeworkRanking

response:
	
	[
        {
          "nickname": "Lolo",
          "total": 74
        },
        {
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
          "nickname": "Lolo",
          "total": 74
        },
        {
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
          "nickname": "Lolo",
          "total": 74
        },
        {
          "nickname": "手机用户0528",
          "total": 27
        }
        ...
    ]