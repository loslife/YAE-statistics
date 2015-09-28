## 关于echarts的option参数配置说明

var option = {
                color: ['#23B7E5'],//系列颜色
                title:{//图表标题
                    text:'视频投票数',
                    subtext:'数据来自——美甲大咖',
                    x : 'center',
                },
                tooltip: {//提示框
                    show: true,
                    trigger: 'axis',//触发类型,默认是数据触发
                    enterable: true,//鼠标是否可进入气泡
                },
                toolbox:{//右上角工具栏
                    show : true,
                    feature : {
                        mark : {show: true},
                        dataView : {show: true, readOnly: true},
                        magicType : {show: true, type: ['line', 'bar']},
                        restore : {show: true},
                        saveAsImage : {show: true}
                    }
                },
                dataZoom:{//底部拖拽栏
                    show:true,
                    realtime:true,//缩放变化实时显示
                    start: 10,//拖动条起始百分比位置
                    end: 90,
                    handleColor:'#008acd',
                    dataBackgroundColor:'#efefff',
                },
                legend: {//图例
                    data:['投票数'],
                    x : 'left',
                },
                grid: {//控制图表边线与绘制的canvans边界距离
                    y: 80,
                    y2: 160,
                    },
                xAxis : [
                    {
                        name : '视频期数',
                        type : 'category',
                        data : vote_result_x,
                        nameTextStyle : {fontSize:15},
                    }
                ],
                yAxis : [
                    {
                        name : '投票数',
                        type : 'value',
                        nameTextStyle : {fontSize:15},
                    }
                ],
                series : [//数据图表
                    {
                        name:'投票数',
                        type:'line',
                        data:vote_result_Y,//Y轴数据
                        itemStyle:{
                            normal: {
                                lineStyle: {
                                    width: 2,
                                    color: '#23B7E5',
                                    shadowColor : 'rgba(0,0,0,0.5)',
                                    shadowBlur: 10,
                                    shadowOffsetX: 8,
                                    shadowOffsetY: 8,
                                },
                                barBorderRadius: 4,
                                label: {show: true},
                                areaStyle: {type: 'default'},//是否显示区域面积
                            },
                            emphasis:{
                                label: {show: true},
                            },
                        },
                        markPoint:{//图表最大最小点
                            data:[
                                {type:'max',name:'最大值'},
                                {type:'min',name:'最小值'},
                            ],
                        },
                        markLine:{//图表平均线
                            data:[
                                {type:'average',name:'平均值'}
                            ],
                        },
                    },
                ],
            };