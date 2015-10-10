## 各项指数统计接口

url: /svc/dakatongji/me/statistics
    
response:

	{
        "infos": [
          {
            "title": "总关注数",
            "value": 263
          },
          {
            "title": "注册用户修改个人图像率",
            "value": "57.59%"
          },
          {
            "title": "注册用户修改背景图片率",
            "value": "0.02%"
          },
          {
            "title": "平均每人关注数",
            "value": "5.25%"
          }
        ]
     }
     
## 粉丝数排行榜

url: /svc/dakatongji/me/fansRanking

query:
    
    num=20
    
response:

    [
        {
          "nickname": "手机用户3789",
          "count": 7
        },
        {
          "nickname": "手机用户5640",
          "count": 6
        },
        {
          "nickname": "蝴蝶淘最美甲",
          "count": 6
        }
    ]
    
## 关注数排行榜

url: /svc/dakatongji/me/followsRanking

query:
    
    num=20
    
response:

    [
        {
          "nickname": "手机用户3789",
          "count": 7
        },
        {
          "nickname": "手机用户5640",
          "count": 6
        },
        {
          "nickname": "蝴蝶淘最美甲",
          "count": 6
        }
    ]
    
## 每日新增关注数

url: /svc/dakatongji/me/followCount

query:
    
    num=20
    
response:

    [
        {
          "day": "20151010",
          "count": 7
        },
        {
          "day": "20151009",
          "count": 1
        }
    ]
    
## 点赞排行榜

url: /svc/dakatongji/me/detailsLikeRanking

query:
    
    num=20
    
response:

    [
        {
          "nickname": "胡波老师",
          "count": 3707
        },
        {
          "nickname": "王红老师",
          "count": 2424
        },
        {
          "nickname": "董亚坡老师",
          "count": 2399
        }
    ]
    
## 每日点赞数

url: /svc/dakatongji/me/detailsLikeCount

query:
    
    num=20
    
response:

    {
        "totalCount": 11010,
        "details": [
          {
            "day": "20151010",
            "count": 51
          },
          {
            "day": "20151009",
            "count": 5
          }
        ]
    }