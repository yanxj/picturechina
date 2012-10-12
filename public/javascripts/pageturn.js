/**
 * Created with JetBrains WebStorm.
 * User: Administrator
 * Date: 12-9-26
 * Time: 下午12:58
 * To change this template use File | Settings | File Templates.
 */
var bodyWidth = 0;
var slideWidth = 0;//id=slide的div的宽度
var pageCount = 1;//页数总计
var pageLength = 0;//第一页的宽度
var smallimgpaddingleft = 15;//小图之间的边距
var divSize = 120;//小图的大小
var borderwidth = 5;
var smallimgsize = 110;//小图的大小
var scrollpading = 15;//小图之间的边距
var selectedID = 0;
var touchEvent = null;//翻页对象
//$(document).ready(function () {
//    analyticData("http://172.32.3.110:3000/thumbnail.js", null,"body");
//});
//获取数据
function getData(url,div) {
    $.getScript(url)
        .success(
        function () {
            analyticData(url, data.items,div);
        }).error(function () {
            alert("获取图片失败，请刷新重试！");
        });
}
//逻辑处理函数
function analyticData(url, datas,div) {
    if (datas == null) {
        getData(url,div);
    } else {
        complatePageProperty(datas);
        touchEvent = new touchClass();
        makeParentDiv(div);
        makeChileDiv("#scroll-parentDiv");
        setAnimation("#scroll-parentDiv");
        makeLeftAndRightButtonDiv("#scroll-parentDiv");
        touchEvent.touch("#scroll-childDiv", pageCount, pageLength);
        //设置大图变化时小图的联动
//        setBigImageEvent();
        $.each(datas, function (key, value) {
            makeImageDiv("#scroll-childDiv", value.id);
            loadImg('#scroll-img-' + value.id, value.url);
            setImgTouch(value.id,key);
            if (key == 0)
                setChecked(value.id);
        });
    }
}
//讲算总页数和页面长度及滑动DIV的宽度
function complatePageProperty(data) {
    bodyWidth = $("body").width();
    pageCount = ((data.length * (smallimgpaddingleft + divSize)) % bodyWidth == 0) ? (data.length * (smallimgpaddingleft + divSize)) / bodyWidth : (Math.floor((data.length * (smallimgpaddingleft + divSize)) / bodyWidth) + 1);
    pageLength = Math.floor(bodyWidth / (smallimgpaddingleft + divSize)) * (smallimgpaddingleft + divSize);
    slideWidth = (smallimgpaddingleft + divSize) * data.length;
}
//加载scroll父层元素
var parentDivZindex = 4;
function makeParentDiv(dom) {
    var tag = "<div id='scroll-parentDiv'></div>";
    $(tag).appendTo(dom);
    $("div#scroll-parentDiv").css({   "margin":"0px auto",
        "position":"absolute",
        "overflow":"hidden",
        "width":"100%",
        "height":divSize + "px",
        "bottom":scrollpading + "px",
        "z-index":parentDivZindex});
}
//加载SCROLL层
var childDivZindex = 5;
function makeChileDiv(dom) {
    var tag = "<div id='scroll-childDiv'></div>";
    $(tag).appendTo(dom);
    $("div#scroll-childDiv").css({   "margin":"0px auto",
        "position":"absolute",
        "width":slideWidth + "px",
        "height":divSize + "px",
        "z-index":childDivZindex});
}
//加载左右提示按钮
var leftPadding = 0;//左提示按钮的边距
var rightPadding = 0;//右提示按钮的边距
var directionZindex = 6;//左右按钮在Z轴上的次序
function makeLeftAndRightButtonDiv(dom) {
    var tag = "<div id='scroll-leftDiv'></div>";
    $(tag).appendTo(dom);
    $("div#scroll-leftDiv").css({   "position":"absolute",
        "width":smallimgpaddingleft + "px",
        "height":divSize + "px",
        "left":leftPadding + "px",
        "background-image":"url(../images/sleft.gif)",
        "background-repeat":"no-repeat",
        "z-index":directionZindex});
    tag = "<div id='scroll-rightDiv'></div>";
    $(tag).appendTo(dom);
    $("div#scroll-rightDiv").css({   "position":"absolute",
        "width":smallimgpaddingleft + "px",
        "height":divSize + "px",
        "right":rightPadding + "px",
        "background-image":"url(../images/sright.gif)",
        "background-repeat":"no-repeat",
        "z-index":directionZindex});
}
//加载图片DIV
function makeImageDiv(dom, id) {
    var tag = "<img id='scroll-img-" + id + "' src='./images/loading_circle.gif'></img>";
    $(tag).appendTo(dom);
    $("#scroll-img-" + id).css({
            "width":smallimgsize + "px",
            "height":smallimgsize + "px",
            "border":borderwidth + "px solid white",
            "marginLeft":"15px"
        }
    )
}
//加载图片
function loadImg(id, url) {
    $(id).load(url, function () {
        $(id).attr("src", url);
    });
}
//设置图片被选中事件
function setChecked(id) {
    $("#scroll-img-" + selectedID).css("border-color", "white");
    $("#scroll-img-" + id).css("border-color", "blue");
    selectedID = id;
}
//设置缩略图点击事件
function setImgTouch(id,key) {
    var velocitys = 0;
    $('#scroll-img-' + id).on("touchstart touchmove touchend", function (event) {
        var touch = event.originalEvent.touches[0] || event.originalEvent.changedTouches[0];
        if (event.type == 'touchmove') {
            velocitys++;
        }
        if (event.type == 'touchend') {
            if (velocitys < 2) {
                setChecked(id);
                //更换大图事件
                 css3Flip.moveToPoint(key);
            }
            velocitys = 0;
        }
    });
}
//设置大图翻页时小图的联动
function setScrollImgLinkAge(id, key) {
    var currPage = 1;//第KEY张图片所在的页
    var move = 0;//翻页时移动的距离
    currPage = Math.ceil((divSize + scrollpading) * (key+1) / pageLength);
    move = -(currPage - 1) * pageLength;
   // touchEvent.setCurrentPage(currPage);
    //touchEvent.setDist(move);
    $("div#scroll-childDiv").css({
        "-webkit-transform":"translate3d(" + (move) + "px,0px,0px)",
        "-moz-transform":"translate3d(" + (move) + "px,0px,0px)",
        "-o-transform":"translate3d(" + (move) + "px,0px,0px)",
        "-ms-transform":"translate3d(" + (move) + "px,0px,0px)",
        "transform":"translate3d(" + (move) + "px,0px,0px)"
    });
    setChecked(id);

}
//function setScrollImgLinkAge(id, data) {
//    setChecked(id);
//}
//设置大图联动事件
function setBigImageEvent() {
    $("#bigimg").on("touchend", function () {
        setScrollImgLinkAge("19846922", 22);
    });
}
//设置小图点击时的大图联动事件
function setTouchSamllImgLingAge() {
    $("#bigimg").on("touchend", function () {
        setScrollImgLinkAge("19846966", 6);
    });
}
//设置动画过度
function setAnimation(el) {
    $("div#scroll-childDiv").css({"-webkit-transition":"-webkit-transform .5s ease-out",
        "-moz-transition":"-moz-transform .5s ease-out",
        "-o-transition":"-o-transform .5s ease-out",
        "-ms-transition":"-ms-transform .5s ease-out",
        "transition":"transform .5s ease-out",
        "-webkit-transform-style":"preserve-3d",
        "-moz-transform-style":"preserve-3d",
        "-o-transform-style":"preserve-3d",
        "-ms-transform-style":"preserve-3d",
        "transform-style":"preserve-3d"
    });
}
