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
    
## 咖币排行榜

url: /svc/dakatongji/member/expAndCoinAnalyse
    
response:

	{
        "总经验值": 888,
        "注册用户人均经验值": 0.17738713543747503,
        "总咖币": 2000,
        "注册用户人均咖币": 0.3995205753096284
    }