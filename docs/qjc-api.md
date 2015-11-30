## 拉取最新活动no接口

url: /svc/dakatongji/getNewestActivity

response:
    
    {
        no: 21
    }
    
## 求教程每期上传图片数量统计接口

url: /svc/dakatongji/qjcPicCount

query:

* 拉取最近期数 num=10

response:
	
    {
        details: [
            {
                no: "150",
                count: 20
            },
            {
                no: "149",
                count: 35
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
                no: "150",
                count: 20
            },
            {
                no: "149",
                count: 66
            },
            ...
        ]
    }
    
## 求教程视频播放数

url: /svc/dakatongji/qjcPlayCount

query:

* 拉取最近期数 num=10

response:
	
    {
        details: [
            {
                no: "150",
                count: 20
            },
            {
                no: "149",
                count: 66
            },
            ...
        ]
    }
    
## 求教程视频评论数

url: /svc/dakatongji/qjcCommentsCount

query:

* 拉取最近期数 num=10

response:
	
    {
        details: [
            {
                no: "150",
                count: 20
            },
            {
                no: "149",
                count: 66
            },
            ...
        ]
    }