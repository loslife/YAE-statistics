## 经验值排行榜

url: /svc/dakatongji/member/expRanking
    
query:
    
    num=20
    
response:

	[
        {
          "nickname": "勿忘我",
          "exp": 888
        },
        {
          "nickname": "手机用户2891",
          "exp": 0
        },
        {
          "nickname": "手机用户5055",
          "exp": 0
        }
    ]
    
## 咖币排行榜

url: /svc/dakatongji/member/coinRanking
    
query:
    
    num=20
    
response:

	[
        {
          "nickname": "勿忘我",
          "coin": 2000
        },
        {
          "nickname": "手机用户2891",
          "coin": 0
        },
        {
          "nickname": "手机用户5055",
          "coin": 0
        }
    ]
    
## 注册用户经验、咖币的总数和平均数

url: /svc/dakatongji/member/expAndCoinAnalyse
    
response:

	{
        "总经验值": 888,
        "注册用户人均经验值": 0.17738713543747503,
        "总咖币": 2000,
        "注册用户人均咖币": 0.3995205753096284
    }
    
## 注册用户每日获得经验、咖币的总数和平均数

url: /svc/dakatongji/member/expAndCoinCount
    
query:
    
    num=20
    
response:

	[
        {
          "day": "20151013",
          "exps": 2,
          "coins": 3,
          "avgexp": 0.0004,
          "avgcoin": 0.0006
        },
        {
          "day": "20151012",
          "exps": 5,
          "coins": null,
          "avgexp": 0.001,
          "avgcoin": null
        }
    ]
      
## 经验指标获取排行榜

url: /svc/dakatongji/member/targetRanking
    
query:
    
    target=1
    num=20
    
response:

	[
        {
          "count": 3,
          "nickname": "秋"
        },
        {
          "count": 2,
          "nickname": "大神"
        }
    ]