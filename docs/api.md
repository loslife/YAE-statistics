## 播放统计接口

url: /svc/dakatongji/play

query: 

* 无分类播放次数 cat=0
* 按视频分类播放次数 cat=1
* 按主题分类播放次数 cat=2

* 日: order=0
* 周: order=1
* 月: order=2

response:

    {
        totalCount: 12000,
        details: [
            {
                date: "2015-08-26",
                count: 20
            },
            {
                date: "2015-08-27",
                count: 100
            },
            ...
        ]
    }

## 求教程每期上传图片数量统计接口

url: /svc/dakatongji/qjcPicCount

query:

* 拉取最近期数 num=10

response:
	
    {
        details: [
            {
                date: "2015-08-26",
                count: 20
            },
            {
                date: "2015-08-27",
                count: 100
            },
            ...
        ]
    }

## 求教程每期投票总数统计接口

url: /svc/dakatongji/qjcVoteCount

query:

* 拉取最近期数 num=10

response:
	
    {
        details: [
            {
                date: "2015-08-26",
                count: 20
            },
            {
                date: "2015-08-27",
                count: 100
            },
            ...
        ]
    }

## 各项指数统计接口

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