## 获取视频分类列表接口

url: /svc/dakatongji/getCategories

response:

    [
          {
            "id": "1",
            "name": "极致教学"
          },
          {
            "id": "1ea6d1a0-3408-11e5-bae2-c5191ff0283d",
            "name": "活动"
          },
          {
            "id": "bbf17670-10bf-11e5-8e7e-ad2e18eb72b9",
            "name": "每日更新"
          }
    ]
    
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
                day: "20150826",
                count: 20
            }
            ...
        ],
        appDetails: [],
        wechatDetails: []
    }
    
    {
        totalCount: 12000,
        details: [
            {
                week: "201508",
                count: 20
            }
            ...
        ],
        appDetails: [],
        wechatDetails: []
    }
    
    {
        totalCount: 12000,
        details: [
            {
                month: "201508",
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
                day: "20150826",
                count: 20
            }
            ...
        ],
        appDetails: [],
        wechatDetails: []
    }
    
    {
        totalCount: 12000,
        details: [
            {
                week: "201508",
                count: 20
            }
            ...
        ],
        appDetails: [],
        wechatDetails: []
    }
    
    {
        totalCount: 12000,
        details: [
            {
                month: "201508",
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
                day: "20150826",
                count: 20
            }
            ...
        ],
        appDetails: [],
        wechatDetails: []
    }
    
    {
        totalCount: 12000,
        details: [
            {
                week: "201508",
                count: 20
            }
            ...
        ],
        appDetails: [],
        wechatDetails: []
    }
    
    {
        totalCount: 12000,
        details: [
            {
                month: "201508",
                count: 20
            }
            ...
        ],
        appDetails: [],
        wechatDetails: []
    }