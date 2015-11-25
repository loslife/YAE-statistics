## 圈子数据统计

url: /svc/dakatongji/communities/staticits

response:

    [
        {
          "title": "用户关注圈子的数量",
          "value": 23
        },
        {
          "title": "点赞数",
          "value": 21
        },
        {
          "title": "圈子评论数量",
          "value": 123
        }
    ]
    
## 圈子活跃度排名

url: /svc/dakatongji/communities/communitiesRanking

query: 

    rankby=0
    num=10
    
    rankby:
            0   // 按人数排名
            1   // 按总话题数排行
            2   // 按当日回复数排行
            3   // 按当日进入数排行

response:

    [
        {
          "name": "阿娇JK就JJ",
          "count": 0
        },
        {
          "name": "美丽动人",
          "count": 0
        },
        {
          "name": "热腾腾",
          "count": 0
        }
    ]
    
## 老师（官方）圈子活跃度排名

url: /svc/dakatongji/communities/teacherCommunitiesRanking

query: 

    rankby=0
    num=10
    
    rankby:
            0   // 按人数排名
            1   // 按总话题数排行
            2   // 按当日回复数排行
            3   // 按当日进入数排行

response:

    [
        {
          "name": "阿娇JK就JJ",
          "count": 0
        },
        {
          "name": "美丽动人",
          "count": 0
        },
        {
          "name": "热腾腾",
          "count": 0
        }
    ]
    
## 每日圈子发帖数

url: /svc/dakatongji/communities/communitiesPostsCount

response:
    
    [
        {
          "count": 1,
          "time": "20151125"
        }
        ...
    ]
    
## 每日圈子评论数

url: /svc/dakatongji/communities/communitiesCommentsCount

response:
    
    [
        {
          "count": 1,
          "time": "20151125"
        }
        ...
    ]
    
## 每日圈子浏览数

url: /svc/dakatongji/communities/communitiesReadCount

response:
    
    [
        {
          "count": 1,
          "time": "20151125"
        }
        ...
    ]
    
## 获取所有圈子列表

url: /svc/dakatongji/communities/getAllcommunities

response:

    [
        {
          "id": "00c58b90-70c6-11e5-9799-9b6e5163da77",
          "name": "动人美丽"
        },
        {
          "id": "01b23770-73e5-11e5-9ed7-19235bf26c7c",
          "name": "你好美女勾"
        }
        ...
    ]
    
## 单个圈子发帖数

url: /svc/dakatongji/communities/communitiesPostsSingleCount

query: 

    id=xxxx
    num=20

response:

    [
        {
          "count": 1,
          "time": "20151125"
        }
        ...
    ]
    
    
## 单个圈子评论数

url: /svc/dakatongji/communities/communitiesCommentsSingleCount

query: 

    id=xxxx
    num=20

response:

    [
        {
          "count": 1,
          "time": "20151125"
        }
        ...
    ]
    
## 单个圈子评论数

url: /svc/dakatongji/communities/communitiesReadSingleCount

query: 

    id=xxxx
    num=20

response:

    [
        {
          "count": 1,
          "time": "20151125"
        }
        ...
    ]
