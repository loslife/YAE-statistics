app.controller('dakaQjcCtrl', ['$rootScope', '$scope', '$http', function ($rootScope, $scope, $http) {

    (function init(){
        initVote();
        initPic();
    })();

    $scope.pic_result = [];
    $scope.vote_result = [];

    //默认参数
    $scope.vote = {
        recentVote: 10,
        showVoteSpline: true
    };
    $scope.photo = {
        recentPhoto: 10,
        showPicSpline: true
    };

    //获取投票参数
    $scope.qjcVoteCount = function (recentVote){

        $http.get("/svc/dakatongji/qjcVoteCount?num=" + recentVote).success(function(data) {

            var details = data.result.details;

            $scope.vote_result = _.map(details, function(element){
                return [element.no, element.count];
            });
            resetRefresh();
            console.log($scope.vote_result);

        }).error(function(data, status) {

            console.log("qjcVoteCount in error");

        });
    };

    //监听投票参数变化
    $scope.$watch('vote',function(newVal,oldVal){
        if(newVal !== oldVal && newVal.recentVote !== oldVal.recentVote){
            $scope.qjcVoteCount($scope.vote.recentVote);
        }
        if(newVal !== oldVal && newVal.showVoteSpline !== oldVal.showVoteSpline){
            resetRefresh();
        }
    },true);

    //获取上传图片参数
    $scope.qjcPicCount = function (recentPhoto){
        $http.get("/svc/dakatongji/qjcPicCount?num=" + recentPhoto).success(function(data) {

            var details = data.result.details;

            $scope.pic_result = _.map(details, function(element){
              return [element.no, element.count];
            });
            resetRefreshPic();
            console.log($scope.pic_result);

        }).error(function(data, status) {

            console.log("qjcPicCount in error");

        });
    };

    //监听上传图片参数变化
    $scope.$watch('photo',function(newVal,oldVal){
        if(newVal !== oldVal && newVal.recentPhoto !== oldVal.recentPhoto){
            $scope.qjcPicCount($scope.photo.recentPhoto);
        }
        if(newVal !== oldVal && newVal.showPicSpline !== oldVal.showPicSpline){
            resetRefreshPic();
        }
    },true);

    //获取投票最新活动期数
    function initVote(){
        $http.get("/svc/dakatongji/getNewestActivity").success(function(data) {

            $scope.no = data.result.no;
            $http.get("/svc/dakatongji/qjcVoteCount?num=" + $scope.vote.recentVote).success(function(data) {

                var details = data.result.details;
                $scope.vote_result = _formatData(details, $scope.no, $scope.vote.recentVote);
                resetRefresh();
                console.log($scope.vote_result);

            }).error(function(data, status) {

                console.log("qjcVoteCount in error");

            });

        }).error(function(data, status) {

            console.log("qjcVoteCount in error");

        });
    }

    //获取上传图片最新活动期数
    function initPic(){
        $http.get("/svc/dakatongji/getNewestActivity").success(function(data) {
            $scope.no = data.result.no;
            $http.get("/svc/dakatongji/qjcPicCount?num=" + $scope.photo.recentPhoto).success(function(data) {

                var details = data.result.details;
                $scope.pic_result = _formatData(details, $scope.no, $scope.photo.recentPhoto);
                resetRefreshPic();
                console.log($scope.pic_result);

            }).error(function(data, status) {

                console.log("qjcPicCount in error");

            });
        }).error(function(data, status) {

            console.log("qjcPicCount in error");

        });
    }

    //判断所选期数的数据是否为空
    function _formatData(details, no, num){
        var length = details.length;
        if(num == length){
            return _.map(details, function(el){
                return [el.no, el.count];
            });
        }
        for(var i=0; i<num; i++){
            var flag = true;
            for(var j=0; j<details.length; j++){
                var detail = details[j];
                if(detail.no === (no - i)){
                    flag = false;
                    break;
                }
            }
            if(flag){
                details.splice(i, 0, {no: no - i,count: 0});
            }
        }
        return _.map(details, function(el){
            return [el.no, el.count];
        });
    }

    //产生随机数用于监听
    function resetRefresh(){
        $scope.refresh = Math.random();
    }
    function resetRefreshPic(){
        $scope.refreshPic = Math.random();
    }

    var options = {};

    function init(plot) {
        // This is kind of a hack. There are no hooks in Flot between
        // the creation and measuring of the ticks (setTicks, measureTickLabels
        // in setupGrid() ) and the drawing of the ticks and plot box
        // (insertAxisLabels in setupGrid() ).
        //
        // Therefore, we use a trick where we run the draw routine twice:
        // the first time to get the tick measurements, so that we can change
        // them, and then have it draw it again.
        var secondPass = false;
        plot.hooks.draw.push(function (plot, ctx) {
            if (!secondPass) {
                // MEASURE AND SET OPTIONS
                $.each(plot.getAxes(), function(axisName, axis) {
                    var opts = axis.options // Flot 0.7
                        || plot.getOptions()[axisName]; // Flot 0.6
                    if (!opts || !opts.axisLabel)
                        return;

                    var w, h;
                    if (opts.axisLabelUseCanvas != false)
                        opts.axisLabelUseCanvas = true;

                    if (opts.axisLabelUseCanvas) {
                        // canvas text
                        if (!opts.axisLabelFontSizePixels)
                            opts.axisLabelFontSizePixels = 14;
                        if (!opts.axisLabelFontFamily)
                            opts.axisLabelFontFamily = 'sans-serif';
                        // since we currently always display x as horiz.
                        // and y as vertical, we only care about the height
                    /*w = opts.axisLabelFontSizePixels + 3; */
                        h = opts.axisLabelFontSizePixels;

                    } else {
                        // HTML text
                        var elem = $('<div class="axisLabels" style="position:absolute;">' + opts.axisLabel + '</div>');
                        plot.getPlaceholder().append(elem);
                        w = elem.outerWidth(true);
                        h = elem.outerHeight(true);
                        elem.remove();
                    }

                    if (axisName.charAt(0) == 'x')
                        axis.labelHeight += h;
                    else
                        axis.labelWidth += w;
                    opts.labelHeight = axis.labelHeight;
                    opts.labelWidth = axis.labelWidth;
                });
                // re-draw with new label widths and heights
                secondPass = true;
                plot.setupGrid();
                plot.draw();


            } else {
                // DRAW
                $.each(plot.getAxes(), function(axisName, axis) {
                    var opts = axis.options // Flot 0.7
                        || plot.getOptions()[axisName]; // Flot 0.6
                    if (!opts || !opts.axisLabel)
                        return;

                    if (opts.axisLabelUseCanvas) {
                        // canvas text
                        var ctx = plot.getCanvas().getContext('2d');
                        ctx.save();
                        ctx.font = opts.axisLabelFontSizePixels + 'px ' +
                            opts.axisLabelFontFamily;
                        var width = ctx.measureText(opts.axisLabel).width;
                        var height = opts.axisLabelFontSizePixels;
                        var x, y;
                        if (axisName.charAt(0) == 'x') {
                            x = plot.getPlotOffset().left + plot.width()/2 - width/2;
                            y = plot.getCanvas().height;
                        } else {
                        /*height += 3;*/
                            x = height * 0.72;
                            y = plot.getPlotOffset().top + plot.height()/2 - width/2;
                        }
                        ctx.translate(x, y-3);
                        ctx.rotate((axisName.charAt(0) == 'x') ? 0 : -Math.PI/2);
                        ctx.fillText(opts.axisLabel, 0, 0);
                        ctx.restore();

                    } else {
                        // HTML text
                        plot.getPlaceholder().find('#' + axisName + 'Label').remove();
                        var elem = $('<div id="' + axisName + 'Label" " class="axisLabels" style="position:absolute;">' + opts.axisLabel + '</div>');
                        if (axisName.charAt(0) == 'x') {
                            elem.css('left', plot.getPlotOffset().left + plot.width()/2 - elem.outerWidth()/2 + 'px');
                            elem.css('bottom', '0px');
                        } else {
                            elem.css('top', plot.getPlotOffset().top + plot.height()/2 - elem.outerHeight()/2 + 'px');
                            elem.css('left', '0px');
                        }
                        plot.getPlaceholder().append(elem);
                    }
                });
                secondPass = false;
            }
        });
    }



    $.plot.plugins.push({
        init: init,
        options: options,
        name: 'axisLabels',
        version: '1.0'
    });

}]);