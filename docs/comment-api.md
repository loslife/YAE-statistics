## 系列播放统计接口

url: /svc/dakatongji/getCommentsByTime

query: 

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

url: /svc/dakatongji/getCommentsByNo

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
