
/**
 * Created with JetBrains WebStorm.
 * User: Administrator
 * Date: 12-9-28
 * Time: 上午9:01
 * To change this template use File | Settings | File Templates.
 */
var imgSize = 150;//图片大小
var parentDivSize = 270;//下列列表的父层
var childDivHeight = 190;//图片加标题层的高度
var childDivWidth = 100;//图片和标题所依附的层的宽度
var titleDivSize = 30;//标题层的高度
var barDivLeftMargin = 15;//手柄层距左侧的距离
var barBottomMargin = 0;//手柄层距底部的距离
var parentZindex = -5;//父层的Z—INDEX
var childZindex = 51;//子层的Z—INDEX
var barUrl = "images/bar.png";//bar图片的本地地址
var barImgWidth = 15;//bar图片的宽度
var barImgHeight = 15;//bar图片的高度
var waitingImg = "images/loading_circle.gif"//LOADING图片本地地址
var noImg="images/noimg.jpg";
var wordSpace = 15;//标题文字之间的距离
var fontSize = 16;//标题字的大小
var fontFamily = "黑体";//标题字体
var fontColor = "white";//标题字颜色
var datas = {
    "columns":[
        { "picurl":"http://images.china.com.cn/attachement/jpg/site1000/20120912/002564bb20a211ba79f44e.jpg", "name":"新闻", "url":"http://www.china.com.cn/photo/zhuanti/7121183.xml", "color":"red" },
        { "picurl":"http://images.china.com.cn/attachement/jpg/site1000/20120914/002564bb20a211bd2c7006.jpg", "name":"人文", "url":"http://www.china.com.cn/photo/zhuanti/7121184.xml", "color":"blue" },
        { "picurl":"http://images.china.com.cn/attachement/jpg/site1000/20120914/002564bb20a211bd14be4c.jpg", "name":"美图", "url":"http://www.china.com.cn/photo/zhuanti/7121185.xml", "color":"green" },
        { "picurl":"http://images.china.com.cn/attachement/jpg/site1000/20120831/002564bb20a211aa6d741d.jpg", "name":"趣图", "url":"http://www.china.com.cn/photo/zhuanti/7121186.xml ", "color":"pink"}
    ]
}
//标题加载，总入口 url:json地址，data：json数据，若DATA为空则会去加载URL的JSON数据
function columns(url, data) {
//    if (data == null) {
//        getData(url);
//    } else {
        setDivs("body");
//        setMatteTouchEvent("#columns-matte");
        setAnimate("#columns-img-bar", "#columns-parent", "#columns-matte");
        loadingImgDiv("#columns-child", datas.columns);
//    }
}
//获取数据
function getData(url) {
    $.getScript(url)
        .success(
        function () {
            columns(url, data.columns);
        }).error(function () {
            alert('获取图片失败，请刷新重试！');
        });
}
//添加层
function setDivs(dom) {
    var tag = "<div id='columns-matte' style='background:#cccccc;opacity:0;top:0px;margin:0px auto;position: absolute;height: 100%;width:" + $("body").width() + "px;z-index: " + parentZindex + "'></div>" +
        "<div id='columns-parent' style='top:-" + childDivHeight + "px;margin:0px auto;position: absolute;height: " + parentDivSize + "px;width:" + $("body").width() + "px;overflow: hidden;z-index: " + childZindex + "'>" +
        "<div id='columns-child' style=\"margin:0px auto;position: absolute;height: " + childDivHeight + "px;width:" + $("body").width() + "px;\"></div>" +
        "<div id='columns-bar'' style=\"position: absolute;left: " + barDivLeftMargin + "px;bottom: " + barBottomMargin + "px\">" +
        "<img id='columns-img-bar' src=\"" + barUrl + "\" style='width:" + barImgWidth + ";height=" + barImgHeight + "'></div>" +
        "</div>";
    $(tag).appendTo(dom);
    setParentEvent("#columns-parent")
}
//设置div#columns-child的宽度
function setParentEvent(dom) {
    $(dom).on("touchstart touchmove touchend", function (event) {
            event.preventDefault();
            event.stopPropagation();
        }
    )
}
//设置div#columns-child的宽度
function setChildDivWidth(dom, width) {
    $(dom).css("width", width);
}
//解析相应的图片信息
function loadingImgDiv(dom, data) {
    setChildDivWidth(dom, data.length * imgSize);
    var left = 0;
    $.each(data, function (key, value) {
        var tag = "<div id='columns-img-" + key + "' style=\"float: left;position: absolute;left:" + left + "px;\"><img id='img-" + key + "'" +
            "src=\"" + waitingImg + "\"" +
            "style=\"margin:0px auto;height: " + imgSize + "px;width:" + imgSize + "px;position: absolute;\">" +
            "<div style=\"position: absolute;top:" + imgSize
            + "px;margin:0px auto;height: "
            + titleDivSize + "px;width:"
            + imgSize + "px;background: red;text-align: center;line-height: "
            + titleDivSize + "px;letter-spacing: "
            + wordSpace + "px;font-family: '"
            + fontFamily + "';font-weight: bold;font-size: "
            + fontSize + "px;color: "
            + fontColor + ";background:" + value.color + ";\">"
            + value.name
            + "</div></div>";
        $(tag).appendTo(dom);
        left = left + imgSize;
        loadingImg("#img-" + key, value.picurl);
        setImgTouch("#columns-img-" + key, "#columns-img-bar", value.url);
    });
    loadNoImg(left,dom);
}
//加载空图片
function loadNoImg(left,dom){
   var width=$("body").width()-left;
    var count=Math.ceil(width/imgSize);
    for(var i=0;i<count;i++){
        var tag = "<div id='columns-img-" + i + "' style=\"float: left;position: absolute;left:" + left + "px;\"><img id='img-" + i + "'" +
            "src=\"images/noimg.jpg\"" +
            "style=\"margin:0px auto;height: " + imgSize + "px;width:" + imgSize + "px;position: absolute;\">" +
            "<div style=\"position: absolute;top:" + imgSize
            + "px;margin:0px auto;height: "
            + titleDivSize + "px;width:"
            + imgSize + "px;background: red;text-align: center;line-height: "
            + titleDivSize + "px;letter-spacing: "
            + wordSpace + "px;font-family: '"
            + fontFamily + "';font-weight: bold;font-size: "
            + fontSize + "px;color: "
            + fontColor + ";background:black;\">"
            + "暂无"
            + "</div></div>";
        $(tag).appendTo(dom);
        left = left + imgSize;
    }
}
//设置下拉效果
function setAnimate(bar, parent, malte) {

    var flag = 0;
    $(parent).css({"-webkit-transform-style":"preserve-3d",
        "-moz-transform-style":"preserve-3d",
        "-o-transform-style":"preserve-3d",
        "-ms-transform-style":"preserve-3d",
        "transform-style":"preserve-3d",
        "-moz-transition":"-moz-transform .5s ease-out",
        "-webkit-transition":"-webkit-transform .5s ease-out",
        "-o-transition":"-o-transform .5s ease-out",
        "-ms-transition":"-ms-transform .5s ease-out",
        "transition":"transform .5s ease-out"
    });
    $(malte).css({"-moz-transition":"opacity  .5s ease-out",
        "-webkit-transition":"opacity .5s ease-out",
        "-o-transition":"opacity .5s ease-out",
        "-ms-transition":"opacity .5s ease-out",
        "transition":"opacity .5s ease-out"})
    $(bar).on('touchend', function (event) {
            event.preventDefault();
            if (flag == 0) {
                $(parent).css("-webkit-transform", "translate3d(0px," + childDivHeight + "px,0px)");
                $(malte).css("z-index", 50);
                $(malte).css("opacity", ".5");
                setMatteTouchEvent(malte);
                flag = 1;
            } else {
                $(parent).css("-webkit-transform", "translate3d(0px,0px,0px)");
                $(malte).css("opacity", "0");
                $(malte).off("touchstart touchmove touchend");
                $(malte).on('webkitTransitionEnd',function(){
                    if(flag==1)
                    $(malte).css("z-index", 50);
                    else
                        $(malte).css("z-index", -5);
                });
                flag = 0;
            }
        }
    )
}//加载图片
function loadingImg(dom, url) {
    $(dom).load(url, function () {
        $(dom).attr("src", url);
    });
}
//设置图点击事件
function setImgTouch(dom, bar, url) {
    $(dom).on("touchend", function (event) {
        $(bar).trigger("touchend");
        //alert(url);
        location.href = "index.html?url=" + url;
        // yzh_fetchDATA.getDATA(url, showresult);
    });
}
//设置蒙板层点击事件
function setMatteTouchEvent(dom) {
    $(dom).on("touchstart touchmove touchend", function (event) {
            event.preventDefault();
            event.stopPropagation();
        }
    )
}
