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