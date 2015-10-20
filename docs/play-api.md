## 美甲大咖总播放数

url: /svc/dakatongji/getplayAll

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
        ],
        appDetails: [],
        wechatDetails: []
    }
    
    
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
                time: "20150826",
                count: 20
            }
            ...
        ],
        appDetails: [],
        wechatDetails: []
    }
    
## 分期播放统计接口

url: /svc/dakatongji/getplayByTopic

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
        ],
        appDetails: [],
        wechatDetails: []
    }