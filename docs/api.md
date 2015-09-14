## 系列播放统计接口

url: /svc/dakatongji/getplayByCate

query: 

* 系列id: cate=id

* 日: order=0
* 周: order=1
* 月: order=2

* 查询数量: num=10

response:

    {
        totalCount: 12000,
        details: [
            {
                day: "20150826",
                count: 20
            }
            ...
        ]
    }
    
    {
        totalCount: 12000,
        details: [
            {
                week: "201508",
                count: 20
            }
            ...
        ]
    }
    
    {
        totalCount: 12000,
        details: [
            {
                month: "201508",
                count: 20
            }
            ...
        ]
    }
    
## 分期播放统计接口

url: /svc/dakatongji/getplayByNo

query: 

* 查询数量: num=10

response:

    {
        totalCount: 12000,
        details: [
            {
                title: "121",
                count: 20
            }
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
    
## 求教程每期投票总数统计接口

url: /svc/dakatongji/getNewestActivity

response:
    
    {
        no: 21
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