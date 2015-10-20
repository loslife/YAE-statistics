## 美甲大咖总评论数

url: /svc/dakatongji/getCommentsAll

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
                time: "20150826",
                count: 20
            }
            ...
        ]
    }
    
## 美甲大咖系列评论数

url: /svc/dakatongji/getCommentsByCate

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
                time: "20150826",
                count: 20
            }
            ...
        ]
    }
    
## 美甲大咖分期评论数

url: /svc/dakatongji/getCommentsByTopic

query: 

* 主题id: topicId=id

* 日: order=0
* 周: order=1
* 月: order=2

* 查询数量: num=10

response:

    {
        totalCount: 12000,
        details: [
            {
                time: "20150826",
                count: 20
            }
            ...
        ]
    }